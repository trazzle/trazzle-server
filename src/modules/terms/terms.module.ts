import { Module } from "@nestjs/common";
import { TermsController } from "./terms.controller";
import { CustomConfigModule } from "../core/config/custom-config.module";
import { AwsS3Module } from "../core/aws-s3/aws-s3.module";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [CustomConfigModule, AwsS3Module, HttpModule],
  controllers: [TermsController],
})
export class TermsModule {}
