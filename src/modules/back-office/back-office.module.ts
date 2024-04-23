import { Module } from "@nestjs/common";
import { AwsS3Module } from "src/modules/core/aws-s3/aws-s3.module";
import { PrismaModule } from "src/modules/core/database/prisma/prisma.module";
import { BackOfficeController } from "./back-office.controller";
import { BackOfficeService } from "./back-office.service";

@Module({
  imports: [PrismaModule, AwsS3Module],
  providers: [BackOfficeService],
  controllers: [BackOfficeController],
})
export class BackOfficeModule {}
