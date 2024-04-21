import { INestApplication } from "@nestjs/common";
import * as Supertest from "supertest";
import { PrismaService } from "src/modules/core/database/prisma/prisma.service";
import { 테이블_초기화 } from "./common.fixture";
import { CreateCountryDto } from "src/modules/conuntries/dtos/create-country.dto";

export const 국가_초기화 = async (prismaService: PrismaService) => {
  return 테이블_초기화(prismaService, "Country");
};

export const 국가_생성 = async (app: INestApplication, accessToken: string, request: CreateCountryDto) => {
  return Supertest.agent(app.getHttpServer())
    .post("/api/countries")
    .set("Authorization", `Bearer ${accessToken}`)
    .send(request);
};

export const 국가_조회 = async (app: INestApplication, accessToken: string) => {
  return Supertest.agent(app.getHttpServer()).get("/api/countries").set("Authorization", `Bearer ${accessToken}`);
};
