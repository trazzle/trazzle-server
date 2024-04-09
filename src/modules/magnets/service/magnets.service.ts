import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/modules/core/database/prisma/prisma.service";
import { AwsS3Service } from "src/modules/core/aws-s3/aws-s3.service";
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
  ) {}

  list(cityId: number) {
    return this.prismaService.magnet.findMany({
      where: { cityId },
      select,
    });
  }
}
