import { Module } from "@nestjs/common";
import { AwsS3Module } from "src/modules/core/aws-s3/aws-s3.module";
import { PrismaModule } from "src/modules/core/database/prisma/prisma.module";
import backOfficeControllers from "src/modules/back-office/controllers";
import backOfficeServices from "src/modules/back-office/services";

@Module({
  imports: [PrismaModule, AwsS3Module],
  providers: [...backOfficeServices],
  controllers: [...backOfficeControllers],
})
export class BackOfficeModule {}
