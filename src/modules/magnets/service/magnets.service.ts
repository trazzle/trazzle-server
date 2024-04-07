import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateMagnetDto } from "src/modules/magnets/dtos/create-magnet.dto";
import { PrismaService } from "src/modules/core/database/prisma/prisma.service";
import { putObjectCommandDto } from "src/modules/core/aws-s3/dtos/s3-command.dto";
import { AwsS3Service } from "src/modules/core/aws-s3/aws-s3.service";
import { CitiesService } from "src/modules/cities/service/cities.service";
import { v4 as uuidv4 } from "uuid";
import { Prisma } from "@prisma/client";

const select: Prisma.MagnetSelect = {
  id: true,
  url: true,
  cityId: true,
};
@Injectable()
export class MagnetsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly awsS3Service: AwsS3Service,
    private readonly citiesService: CitiesService,
  ) {}

  create(id: number, body: CreateMagnetDto, image: Express.Multer.File) {
    return this.prismaService.$transaction(async transaction => {
      const city = await transaction.city.findUnique({ where: { id: body.cityId } });
      console.log(city);
      if (!city) {
        throw new NotFoundException("도시를 찾을 수 없습니다.");
      }

      const request: putObjectCommandDto = {
        Key: `magnets/${city.name}/${uuidv4()}`,
        Body: image.buffer,
        ContentType: image.mimetype,
      };
      const { url, Key } = await this.awsS3Service.uploadImageToS3Bucket(request);

      const magnet = await transaction.magnet.create({
        data: {
          url: url,
          // key: Key,
          cityId: body.cityId,
        },
      });

      return magnet;
    });
  }

  list(cityId: number) {
    return this.prismaService.magnet.findMany({
      where: {
        cityId,
      },
      select,
    });
  }

  update(id: number, image: Express.Multer.File) {
    return this.prismaService.$transaction(async transaction => {
      const magnet = await transaction.magnet.findUnique({ where: { id } });
      if (!magnet) {
        throw new NotFoundException("마그넷을 찾을 수 없습니다.");
      }

      // 이미지 삭제
      // await this.awsS3Service.deleteImageFromS3Bucket({
      //   Key: magnet.key,
      // });
      await this.awsS3Service.delete(magnet.url);

      const city = await transaction.city.findUnique({ where: { id: magnet.cityId } });

      const request: putObjectCommandDto = {
        Key: `magnets/${city.name}/${uuidv4()}`,
        Body: image.buffer,
        ContentType: image.mimetype,
      };
      const { url, Key } = await this.awsS3Service.uploadImageToS3Bucket(request);

      await transaction.magnet.update({
        where: { id },
        data: {
          url: url,
          // key: Key,
        },
      });
    });
  }

  delete(id: number) {
    return this.prismaService.$transaction(async transaction => {
      const magnet = await transaction.magnet.findUnique({ where: { id } });

      if (!magnet) {
        throw new NotFoundException("마그넷을 찾을 수 없습니다.");
      }

      await this.awsS3Service.delete(magnet.url);
      // await this.awsS3Service.deleteImageFromS3Bucket({
      //   Key: magnet.key,
      // });

      await transaction.magnet.delete({
        where: { id },
      });
    });
  }
}
