import { Injectable } from "@nestjs/common";
import { AwsS3Service } from "src/modules/core/aws-s3/aws-s3.service";
import { PrismaService } from "src/modules/core/database/prisma/prisma.service";

@Injectable()
export class BackOfficeMagnetService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly awsS3Service: AwsS3Service,
  ) {}
}
