import { Global, Module } from "@nestjs/common";
import { PrismaModule } from "./database/prisma/prisma.module";
import { CustomConfigModule } from "./config/custom-config.module";
import { AuthModule } from "./auth/auth.module";
import { RedisModule } from "./redis/redis.module";
import { AwsS3Module } from "./aws-s3/aws-s3.module";

@Global()
@Module({
  imports: [PrismaModule, CustomConfigModule, AuthModule, RedisModule, AwsS3Module],
  exports: [PrismaModule, CustomConfigModule, AuthModule, RedisModule, AwsS3Module],
})
export class CoreModule {}
