import { Module } from '@nestjs/common';
import { MagnetsService } from './service/magnets.service';
import { MagnetsController } from './controller/magnets.controller';
import { PrismaModule } from "src/modules/core/database/prisma/prisma.module";
import { AwsS3Module } from "src/modules/core/aws-s3/aws-s3.module";
import { CitiesModule } from "src/modules/cities/cities.module";

@Module({
  imports:[PrismaModule, AwsS3Module, CitiesModule],
  controllers: [MagnetsController],
  providers: [MagnetsService],
})
export class MagnetsModule {}
