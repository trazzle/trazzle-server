import { PrismaService } from "src/modules/core/database/prisma/prisma.service";
import { 국가_초기화 } from "./country.fixture";
import { 도시_초기화 } from "./city.fixture";
import { 사용자_초기화 } from "./user.fixture";
import { Prisma } from "@prisma/client";
import { 여행기_초기화 } from "./travel-notes.fixture";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app.module";
import { AwsS3Service } from "src/modules/core/aws-s3/aws-s3.service";
import { AllExceptionFilter } from "src/filters/all-exception.filter";
import { HttpExceptionFilter } from "src/filters/http-exception.filter";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { deleteObjectCommandDto, putObjectCommandDto } from "src/modules/core/aws-s3/dtos/s3-command.dto";

export const 테이블_초기화 = async (prismaService: PrismaService, tableName: string) => {
  await prismaService.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`;
  await prismaService.$executeRaw(Prisma.sql`TRUNCATE TABLE ${Prisma.raw(tableName)}`);
  await prismaService.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`;
};

export const 전체_테이블_초기화 = async (prismaService: PrismaService) => {
  await 국가_초기화(prismaService);
  await 도시_초기화(prismaService);
  await 사용자_초기화(prismaService);
  await 여행기_초기화(prismaService);
};

const awsS3ServiceMock = {
  uploadImageToS3Bucket(dto: putObjectCommandDto) {
    console.log(`[awsS3ServiceMock]: ${dto.Key} is uploaded.`);
    const Key = `${this.NODE_MODE}/${dto.Key}`;
    return {
      Key: Key,
      url: `http://localhost/${Key}`,
    };
  },
  deleteImageFromS3Bucket(dto: deleteObjectCommandDto) {
    console.log(`[awsS3ServiceMock]: ${dto.Key} is deleted.`);
  },
  delete(url: string) {
    console.log(`[awsS3ServiceMock]: ${url} is deleted.`);
  },
};

export const initializeApp = async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
    providers: [],
  })
    .overrideProvider(AwsS3Service)
    .useValue(awsS3ServiceMock)
    .compile();

  const app = moduleFixture.createNestApplication();
  app.useGlobalFilters(new AllExceptionFilter(), new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 들어오는 요청의 payload를 DTO의 타입으로 변환
    }),
  );
  await app.init();
  const prismaService = app.get<PrismaService>(PrismaService);
  await 전체_테이블_초기화(prismaService);
  return app;
};

export const tearDownApp = async (app: INestApplication) => {
  const prismaService = app.get<PrismaService>(PrismaService);
  await 전체_테이블_초기화(prismaService);
  await app.close();
};
