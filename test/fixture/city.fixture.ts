import { PrismaService } from "src/modules/core/database/prisma/prisma.service";
import { 테이블_초기화 } from "./common.fixture";
import * as Supertest from "supertest";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { CreateCityDto } from "src/modules/back-office/dtos/req/create-city.dto";
import { SearchCityDto } from "src/modules/cities/dto/search-city.dto";

export const 도시_초기화 = async (prismaService: PrismaService) => {
  return 테이블_초기화(prismaService, "City");
};

export const 도시_생성 = async (app: INestApplication, accessToken: string, request: CreateCityDto) => {
  return await Supertest.agent(app.getHttpServer())
    .post("/api/back-office/cities")
    .set("Authorization", `Bearer ${accessToken}`)
    .send(request);
};

export const 도시_생성_검증 = async (app: INestApplication, accessToken: string, request: CreateCityDto) => {
  const cityResponse = await 도시_생성(app, accessToken, request);
  expect(cityResponse.status).toBe(HttpStatus.CREATED);
  const cityId = cityResponse.body.id;
  expect(cityId).toBeDefined();
  return cityId;
};

export const 도시_조회 = async (app: INestApplication, accessToken: string, query: SearchCityDto) => {
  return Supertest.agent(app.getHttpServer())
    .get("/api/cities")
    .set("Authorization", `Bearer ${accessToken}`)
    .query(query);
};
