import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateTravelNoteDto } from "../dtos/req/create-travel-note.dto";
import { UpdateTravelNoteDto } from "src/modules/travel-notes/dtos/req/update-travel-note.dto";
import { AwsS3Service } from "src/modules/core/aws-s3/aws-s3.service";
import { v4 as uuidv4 } from "uuid";
import { PrismaService } from "src/modules/core/database/prisma/prisma.service";
import { putObjectCommandDto } from "src/modules/core/aws-s3/dtos/s3-command.dto";
import { Prisma } from "@prisma/client";

const select: Prisma.TravelNoteSelect = {
  id: true,
  title: true,
  startDate: true,
  endDate: true,
  review: true,
  createdAt: true,
  userId: true,
  city: {
    select: {
      id: true,
      name: true,
    },
  },
  images: {
    select: {
      id: true,
      sequence: true,
      url: true,
      isMain: true,
    },
  },
};

@Injectable()
export class TravelNotesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly awsS3Service: AwsS3Service,
  ) {}

  async create(userId: number, dto: CreateTravelNoteDto, images: { sequence: number; file: Express.Multer.File }[]) {
    this.validate(dto);

    const count = await this.prismaService.travelNote.count({ where: { userId: userId } });
    if (count >= 100) {
      throw new ConflictException("최대 등록 가능한 여행기 수는 100개 입니다.");
    }

    return this.prismaService.$transaction(async transaction => {
      const travelNote = await transaction.travelNote.create({
        data: {
          userId,
          title: dto.title,
          startDate: dto.startDate.toString(),
          endDate: dto.endDate.toString(),
          review: dto.review,
          cityId: dto.cityId,
          countryCode: dto.countryCode,
          cityName: dto.cityName,
        },
      });

      if (images.length > 0) {
        // 메인 이미지 인덱스
        const mainImageIndex = images.some(image => image.sequence === dto.mainImageIndex) ? dto.mainImageIndex : 1;

        for (const image of images) {
          // 이미지를 스토리지에 저자

          const request: putObjectCommandDto = {
            Key: `travel-notes/${travelNote.id}/${uuidv4()}`,
            Body: image.file.buffer,
            ContentType: image.file.mimetype,
          };
          const { url, Key } = await this.awsS3Service.uploadImageToS3Bucket(request);

          // 여행 일지 이미지 엔티티 생성
          await transaction.travelImage.create({
            data: {
              sequence: image.sequence,
              url: url,
              key: Key,
              isMain: image.sequence === mainImageIndex,
              travelNoteId: travelNote.id,
            },
          });
        }

        return transaction.travelNote.findFirst({
          where: { id: travelNote.id },
          select,
        });
      }
    });
  }

  list(userId: number) {
    return this.prismaService.travelNote.findMany({
      where: { userId },
      select,
    });
  }

  delete(userId: number, travelNoteId: number) {
    return this.prismaService.$transaction(async transaction => {
      const travelNote = await transaction.travelNote.findUnique({
        where: { id: travelNoteId },
        include: { images: true },
      });

      if (!travelNote) {
        throw new NotFoundException("존재 하지 않는 여행 일지 입니다.");
      }

      if (travelNote.userId !== userId) {
        throw new ForbiddenException("권한이 없습니다.");
      }

      // 이미지 삭제
      await Promise.all(travelNote.images.map(image => this.awsS3Service.deleteImageFromS3Bucket({ Key: image.key })));

      await transaction.travelNote.delete({
        where: { id: travelNoteId },
      });
    });
  }

  update(
    userId: number,
    travelNoteId: number,
    dto: UpdateTravelNoteDto,
    images: { sequence: number; file: Express.Multer.File }[],
  ) {
    this.validate(dto);

    return this.prismaService.$transaction(async transaction => {
      const travelNote = await transaction.travelNote.findUnique({
        where: { id: travelNoteId },
        include: { images: true },
      });

      if (!travelNote) {
        throw new NotFoundException("존재 하지 않는 여행 일지 입니다.");
      }

      if (travelNote.userId !== userId) {
        throw new ForbiddenException("권한이 없습니다.");
      }

      await transaction.travelNote.update({
        where: { id: travelNoteId },
        data: {
          cityId: dto.cityId,
          cityName: dto.cityName,
          title: dto.title,
          startDate: dto.startDate.toString(),
          endDate: dto.endDate.toString(),
          review: dto.review,
        },
      });

      /**
       * 이미지 업데이트 예시
       *      1 | 2 | 3 | ... | 6
       * 기존  A | B |
       * 요청    | C | D
       *  => B 삭제 & C, D 추가
       */
      //

      // 기존 이미지 삭제
      const newImageSequences = images.map(image => image.sequence);
      await Promise.all(
        // 기존 이미지 중에 새로 입력한 이미지의 자리 확인
        travelNote.images
          .filter(it => newImageSequences.includes(it.sequence))
          .map(async deletedImage => {
            // S3에서 이미지 삭제
            await this.awsS3Service.deleteImageFromS3Bucket({
              Key: deletedImage.key,
            });
            // 이미지 삭제
            await transaction.travelImage.delete({
              where: { id: deletedImage.id },
            });
          }),
      );

      if (images.length > 0) {
        for (const image of images) {
          // 이미지를 스토리지에 저장
          const request: putObjectCommandDto = {
            Key: `travel-notes/${travelNote.id}/${uuidv4()}`,
            // @ts-ignore
            Body: image.file.buffer,
            ContentType: image.file.mimetype,
          };
          const { url, Key } = await this.awsS3Service.uploadImageToS3Bucket(request);

          await transaction.travelImage.create({
            data: {
              sequence: image.sequence,
              url: url,
              key: Key,
              isMain: false,
              travelNoteId: travelNote.id,
            },
          });
        }
      }

      // 메인 이미지 설정
      if (dto.mainImageIndex) {
        const images = await transaction.travelImage.findMany({
          where: { travelNoteId },
        });
        for (const image of images) {
          await this.prismaService.travelImage.update({
            where: { id: image.id },
            data: {
              isMain: image.sequence === dto.mainImageIndex,
            },
          });
        }
      }
    });
  }

  getOne(id: number) {
    return this.prismaService.travelNote.findFirst({
      where: { id: id },
    });
  }

  private validate(request: CreateTravelNoteDto | UpdateTravelNoteDto) {
    if (request.startDate.isAfter(request.endDate)) {
      throw new BadRequestException("여행 시작일은 여행 종료일보다 빨라야 합니다.");
    }
    if (!request.cityId && !request.cityName) {
      throw new BadRequestException("도시ID[cityId] 또는 도시 이름[cityName]이 필요 합니다.");
    }
    if (request.cityId && request.cityName) {
      throw new BadRequestException("도시ID[cityId]와 도시 이름[cityName] 중 하나만 입력해야 합니다.");
    }
    if (!request.cityId && !request.cityName) {
      throw new BadRequestException("도시ID[cityId]와 도시 이름[cityName] 중 하나는 입력해야 합니다.");
    }
    if (request.cityName && request.cityName.length > 20) {
      throw new BadRequestException("도시 이름[cityName]은 20자까지 입력 가능합니다.");

      if (!request.countryCode) {
        throw new BadRequestException("기타 도시 선택 시 국가 코드[countryCode]는 필수 입니다.");
      }
    }
    if (request.mainImageIndex && (request.mainImageIndex < 1 || request.mainImageIndex > 6)) {
      throw new BadRequestException("메인 이미지 인덱스[mainImageIndex]는 1~6 사이만 가능합니다.");
    }
    if (request.review && request.review.length > 280) {
      throw new BadRequestException("감상문[review]은 280자까지 입력 가능합니다.");
    }
  }
}
