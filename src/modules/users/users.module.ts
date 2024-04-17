import { Module } from "@nestjs/common";
import { UsersService } from "./services/users.service";
import { UsersController } from "./controllers/users.controller";
import { PrismaModule } from "../core/database/prisma/prisma.module";
import { CustomConfigModule } from "src/modules/core/config/custom-config.module";
import { AwsS3Module } from "../core/aws-s3/aws-s3.module";
import { UserStatisticsController } from "src/modules/users/controllers/users.statistics.controller";
import { UserStatisticsService } from "src/modules/users/services/statistics.service";

@Module({
  imports: [PrismaModule, CustomConfigModule, AwsS3Module],
  providers: [UsersService, UserStatisticsService],
  controllers: [UsersController, UserStatisticsController],
  exports: [UsersService],
})
export class UsersModule {}
