import { PrismaService } from "src/modules/core/database/prisma/prisma.service";
import { 테이블_초기화 } from "./common.fixture";
import { Role } from "@prisma/client";
import { INestApplication } from "@nestjs/common";
import * as Supertest from "supertest";
import { v4 } from "uuid";

export const 관리자_초기화 = async (prismaService: PrismaService) => {
  return 테이블_초기화(prismaService, "User");
};

export const 관리자_생성 = async (prismaService: PrismaService, account: string, role: Role = Role.ADMIN) => {
  const adminUser = await prismaService.user.findUnique({ where: { account } });
  if (adminUser) {
    return adminUser;
  }
  return prismaService.user.create({ data: { account, name: account, role } });
};

export const 관리자_로그인 = async (app: INestApplication, account: string): Promise<string> => {
  const response = await Supertest.agent(app.getHttpServer()).post("/api/users/sign-in/account").query({ account });
  expect(response.status).toBe(201);
  expect(response.body.access_token).toBeDefined();

  return response.body.access_token;
};

export const 임의관리자_생성_로그인 = async (
  app: INestApplication,
  prismaService: PrismaService,
  role: Role = Role.ADMIN,
) => {
  const account = v4();
  // TODO: 응답dto 구현후에 내부로직 작성예정
};
