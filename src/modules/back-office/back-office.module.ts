import { Module } from "@nestjs/common";
import { AwsS3Module } from "src/modules/core/aws-s3/aws-s3.module";
import { PrismaModule } from "src/modules/core/database/prisma/prisma.module";
import backOfficeControllers from "src/modules/back-office/controllers";
import backOfficeServices from "src/modules/back-office/services";
import { CustomConfigModule } from "src/modules/core/config/custom-config.module";
import { JwtModule } from "@nestjs/jwt";
import { RedisModule } from "../core/redis/redis.module";

@Module({
  imports: [CustomConfigModule, PrismaModule, AwsS3Module, JwtModule, RedisModule],
  providers: [...backOfficeServices],
  controllers: [...backOfficeControllers],
})
export class BackOfficeModule {}
