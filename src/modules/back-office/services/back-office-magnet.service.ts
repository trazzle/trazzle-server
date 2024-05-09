import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { AwsS3Service } from "src/modules/core/aws-s3/aws-s3.service";
import { PrismaService } from "src/modules/core/database/prisma/prisma.service";
import { putObjectCommandDto } from "src/modules/core/aws-s3/dtos/s3-command.dto";
import { v4 as uuidv4 } from "uuid";
import { CreateMagnetDto } from "src/modules/back-office/dtos/req/create-magnet.dto";

@Injectable()
export class BackOfficeMagnetService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly awsS3Service: AwsS3Service,
  ) {}

  create(dto: CreateMagnetDto, image: Express.Multer.File) {
    return this.prismaService.$transaction(async transaction => {
      const city = await transaction.city.findUnique({ where: { id: dto.cityId } });
      if (!city) {
        throw new BadRequestException("존재하지 않는 도시입니다.");
      }
      const request: putObjectCommandDto = {
        Key: `magnets/${dto.cityId}/${uuidv4()}`,
        Body: image.buffer,
        ContentType: image.mimetype,
      };
      const { url } = await this.awsS3Service.uploadImageToS3Bucket(request);
      return transaction.magnet.create({
        data: {
          cityId: dto.cityId,
          url: url,
          isFree: dto.cost && dto.cost > 0,
          cost: dto.cost || 0,
        },
      });
    });
  }

  delete(id: number) {
    return this.prismaService.$transaction(async transaction => {
      const magnet = await transaction.magnet.findUnique({ where: { id } });
      if (!magnet) {
        throw new NotFoundException("존재하지 않는 마그넷입니다.");
      }
      // S3에서 이미지 삭제
      await this.awsS3Service.delete(magnet.url);
      // 이미지 삭제
      await transaction.magnet.delete({
        where: { id },
      });
    });
  }
}
