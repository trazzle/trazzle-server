import { INestApplication } from "@nestjs/common";
import * as Supertest from "supertest";
import { PrismaService } from "src/modules/core/database/prisma/prisma.service";

export const 국가_초기화 = async (prismaService: PrismaService) => {
  prismaService.$executeRaw`TRUNCATE TABLE Country CASCADE`;
}

export const 국가_생성 = async (app: INestApplication, accessToken: string, request: any) => {
  const response = await Supertest.agent(app.getHttpServer())
    .post("/api/countries")
    .set("Authorization", `Bearer ${accessToken}`)
    .send(request)



  //expect(response.status).toBe(201);
  return response;
}
