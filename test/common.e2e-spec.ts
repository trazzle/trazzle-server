import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app.module";
import { AllExceptionFilter } from "src/filters/all-exception.filter";
import { HttpExceptionFilter } from "src/filters/http-exception.filter";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as Supertest from "supertest";
import TestAgent from "supertest/lib/agent";
import { deleteObjectCommandDto, putObjectCommandDto } from "src/modules/core/aws-s3/dtos/s3-command.dto";
import { AwsS3Service } from "src/modules/core/aws-s3/aws-s3.service";

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
  return app;
};

export const initializeRequest = (app: INestApplication, accessToken: string): TestAgent => {
  return Supertest.agent(app.getHttpServer()).set("Authorization", `Bearer ${accessToken}`);
};
