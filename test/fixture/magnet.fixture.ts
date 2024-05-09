import * as Supertest from "supertest";
import { createReadStream } from "fs";
import { resolve } from "path";
import { path } from "app-root-path";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { CreateMagnetDto } from "src/modules/back-office/dtos/req/create-magnet.dto";
import { PrismaService } from "src/modules/core/database/prisma/prisma.service";
import { 테이블_초기화 } from "./common.fixture";

export const 마그넷_초기화 = async (prismaService: PrismaService) => {
  return 테이블_초기화(prismaService, "Magnet");
};

export const 마그넷_생성 = async (app: INestApplication, accessToken: string, dto: CreateMagnetDto, image?: string) => {
  const request = Supertest.agent(app.getHttpServer())
    .post("/api/back-office/magnets")
    .set("Authorization", `Bearer ${accessToken}`)
    .set("Content-Type", "multipart/form-data");
  if (dto.cityId) {
    request.field("cityId", dto.cityId);
  }
  if (dto.cost) {
    request.field("cost", dto.cost);
  }
  if (image) {
    request.attach("image", createReadStream(resolve(path, "test", "data", image)));
  }
  return request;
};

export const 마그넷_생성_검증 = async (
  app: INestApplication,
  accessToken: string,
  dto: CreateMagnetDto,
  image?: string,
) => {
  const request = Supertest.agent(app.getHttpServer())
    .post("/api/back-office/magnets")
    .set("Authorization", `Bearer ${accessToken}`)
    .set("Content-Type", "multipart/form-data");
  if (dto.cityId) {
    request.field("cityId", dto.cityId);
  }
  if (dto.cost) {
    request.field("cost", dto.cost);
  }
  if (image) {
    request.attach("image", createReadStream(resolve(path, "test", "data", image)));
  }
  const response = await request;
  expect(response.status).toBe(HttpStatus.CREATED);
  return response;
};

export const 마그넷_조회 = async (app: INestApplication, accessToken: string, cityId: number) => {
  return Supertest.agent(app.getHttpServer())
    .get("/api/magnets")
    .set("Authorization", `Bearer ${accessToken}`)
    .query({ cityId });
};
export const 마그넷_삭제 = async (app: INestApplication, accessToken: string, magnetId: number) => {
  return Supertest.agent(app.getHttpServer())
    .delete(`/api/back-office/magnets/${magnetId}`)
    .set("Authorization", `Bearer ${accessToken}`);
};
