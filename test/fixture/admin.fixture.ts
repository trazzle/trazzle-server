import { PrismaService } from "src/modules/core/database/prisma/prisma.service";
import { 테이블_초기화 } from "./common.fixture";
import { INestApplication } from "@nestjs/common";
import * as Supertest from "supertest";
import { CreateAdminRequestBodyDto } from "src/modules/back-office/dtos/req/create-admin-request-body.dto";
import { UpdateAdminInfoRequestBodyDto } from "src/modules/back-office/dtos/req/update-admin-info-request-body.dto";
import { GetAdminsRequestQueryDto } from "src/modules/back-office/dtos/req/get-admins-request-query.dto";

export const 관리자_초기화 = async (prismaService: PrismaService) => {
  return 테이블_초기화(prismaService, "User");
};

export const 관리자_생성 = async (app: INestApplication, request: CreateAdminRequestBodyDto) => {
  const response = await Supertest.agent(app.getHttpServer())
    .post("/api/back-office/admins")
    .set("Content-Type", "application.json")
    .send(request);

  return response;
};

export const 관리자정보_수정 = async (
  app: INestApplication,
  accessToken: string,
  request: UpdateAdminInfoRequestBodyDto,
) => {
  const response = await Supertest.agent(app.getHttpServer())
    .patch("/api/back-office/admins")
    .set("Authorization", `Bearer ${accessToken}`)
    .set("Content-Type", "application/json")
    .send(request);

  return response;
};

export const 관리자_목록_조회 = async (
  app: INestApplication,
  accessToken: string,
  request: GetAdminsRequestQueryDto,
) => {
  const response = await Supertest.agent(app.getHttpServer())
    .get("/api/back-office/admins")
    .set("Authorization", `Bearer ${accessToken}`)
    .set("Content-Type", "application/json")
    .query({ ...request });

  return response;
};

export const 관리자_정보_조회 = async (app: INestApplication, accessToken: string, patient_id: number) => {
  const response = await Supertest.agent(app.getHttpServer())
    .get(`/api/back-office/admins/${patient_id}`)
    .set("Authorization", `Bearer ${accessToken}`)
    .set("Content-Type", "application/json");
  return response;
};

export const 관리자_삭제 = async (app: INestApplication, accessToken: string) => {
  const response = await Supertest.agent(app.getHttpServer())
    .delete("/api/back-office/admins")
    .set("Authorization", `Bearer ${accessToken}`)
    .set("Content-Type", "application/json");

  return response;
};
