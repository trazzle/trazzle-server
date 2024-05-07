import { BadRequestException, Injectable } from "@nestjs/common";
import { AwsS3Service } from "src/modules/core/aws-s3/aws-s3.service";
import { PrismaService } from "src/modules/core/database/prisma/prisma.service";
import { putObjectCommandDto } from "src/modules/core/aws-s3/dtos/s3-command.dto";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class BackOfficeMagnetService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly awsS3Service: AwsS3Service,
  ) {}

  create(cityId: number, image: Express.Multer.File) {
    if (!image) {
      throw new BadRequestException("이미지 파일이 필요합니다.");
    }

    return this.prismaService.$transaction(async transaction => {
      const city = await transaction.city.findUnique({ where: { id: cityId } });
      if (!city) {
        throw new BadRequestException("존재하지 않는 도시입니다.");
      }
      const request: putObjectCommandDto = {
        Key: `magnets/${cityId}/${uuidv4()}`,
        Body: image.buffer,
        ContentType: image.mimetype,
      };
      const { url } = await this.awsS3Service.uploadImageToS3Bucket(request);
      return transaction.magnet.create({
        data: {
          cityId,
          url: url,
        },
      });
    });
  }
}
