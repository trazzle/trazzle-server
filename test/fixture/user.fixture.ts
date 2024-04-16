import { PrismaService } from "src/modules/core/database/prisma/prisma.service";
import { UserEntity } from "src/modules/users/entities/user.entity";
import * as Supertest from "supertest";
import { INestApplication } from "@nestjs/common";

export const 사용자_생성 = async (prismaService: PrismaService, account: string): Promise<UserEntity> => {
  const user = await prismaService.user.findUnique({ where: { account } });
  if (user) {
    return user;
  }
  return prismaService.user.create({ data: { account, name: account } });
};

export const 사용자_삭제 = async (prismaService: PrismaService, id: number): Promise<void> => {
  await prismaService.user.delete({ where: { id } });
};

export const 사용자_로그인 = async (app: INestApplication, account: string): Promise<string> => {
  const response = await Supertest.agent(app.getHttpServer())
    .post('/api/users/sign-in/account')
    .query({ account });
  expect(response.status).toBe(201);
  expect(response.body.access_token).toBeDefined();

  return response.body.access_token;
}

