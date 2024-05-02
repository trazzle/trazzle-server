import { PrismaService } from "src/modules/core/database/prisma/prisma.service";
import { UserEntity } from "src/modules/users/entities/user.entity";
import * as Supertest from "supertest";
import { INestApplication } from "@nestjs/common";
import { v4 } from "uuid";
import { 테이블_초기화 } from "./common.fixture";
import { Role } from "@prisma/client";

export const 사용자_생성 = async (
  prismaService: PrismaService,
  account: string,
  role: Role = Role.USER,
): Promise<UserEntity> => {
  const user = await prismaService.user.findUnique({ where: { account } });
  if (user) {
    return user;
  }
  return prismaService.user.create({ data: { account, name: account, role } });
};

export const 사용자_삭제 = async (prismaService: PrismaService, id: number): Promise<void> => {
  await prismaService.user.delete({ where: { id } });
};

export const 사용자_로그인 = async (app: INestApplication, account: string): Promise<string> => {
  const response = await Supertest.agent(app.getHttpServer()).post("/api/users/sign-in/account").query({ account });
  expect(response.status).toBe(201);
  expect(response.body.access_token).toBeDefined();

  return response.body.access_token;
};

export const 사용자_초기화 = async (prismaService: PrismaService) => {
  return 테이블_초기화(prismaService, "User");
};

export const 임의사용자_생성_로그인 = async (
  app: INestApplication,
  prismaService: PrismaService,
  role: Role = Role.USER,
): Promise<LoginResponse> => {
  const account = v4();
  const userEntity = await 사용자_생성(prismaService, account, role);
  const accessToken = await 사용자_로그인(app, account);
  return { userId: userEntity.id, account, accessToken };
};

export type LoginResponse = { userId: number; account: string; accessToken: string };
