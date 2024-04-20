import { PrismaService } from "src/modules/core/database/prisma/prisma.service";
import { 테이블_초기화 } from "./common.fixture";
import * as Supertest from "supertest";
import { INestApplication } from "@nestjs/common";
import { CreateCityDto } from "src/modules/cities/dto/create-city.dto";

export const 도시_초기화 = async (prismaService: PrismaService) => {
  return 테이블_초기화(prismaService, "City");
};

export const 도시_생성 = async (app: INestApplication, accessToken: string, request: CreateCityDto) => {
  return await Supertest.agent(app.getHttpServer())
    .post("/api/cities")
    .set("Authorization", `Bearer ${accessToken}`)
    .send(request);
};
