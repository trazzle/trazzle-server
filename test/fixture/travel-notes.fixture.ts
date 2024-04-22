import { PrismaService } from "src/modules/core/database/prisma/prisma.service";
import { 테이블_초기화 } from "./common.fixture";
import * as Supertest from "supertest";
import { INestApplication } from "@nestjs/common";
import { CreateTravelNoteDto } from "src/modules/travel-notes/dtos/req/create-travel-note.dto";
import { createReadStream } from "fs";
import { resolve } from "path";
import { path } from "app-root-path";

export const 여행일지_초기화 = async (prismaService: PrismaService) => {
  await 테이블_초기화(prismaService, "TravelImage");
  await 테이블_초기화(prismaService, "TravelNote");
};

export const 여행일지_생성 = async (
  app: INestApplication,
  accessToken: string,
  body: CreateTravelNoteDto,
  images: string[] = [],
) => {
  const request = Supertest.agent(app.getHttpServer())
    .post("/api/travel-notes")
    .set("Authorization", `Bearer ${accessToken}`)
    .set("Content-Type", "multipart/form-data");

  if (body.startDate) {
    request.field("startDate", body.startDate.toString());
  }

  if (body.endDate) {
    request.field("endDate", body.endDate.toString());
  }

  if (body.title) {
    request.field("title", body.title);
  }

  if (body.review) {
    request.field("review", body.review);
  }

  if (body.cityId) {
    request.field("cityName", body.cityId);
  }

  if (body.cityName) {
    request.field("cityName", body.cityName);
  }

  if (body.mainImageIndex) {
    request.field("mainImageIndex", body.mainImageIndex);
  }

  for (let index = 0; index < images.length; index++) {
    request.attach(`image${index + 1}`, createReadStream(resolve(path, "test", "data", images[index])));
  }

  return request;
};
