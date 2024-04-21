import { PrismaService } from "src/modules/core/database/prisma/prisma.service";
import { 국가_초기화 } from "./country.fixture";
import { 도시_초기화 } from "./city.fixture";
import { 사용자_초기화 } from "./user.fixture";
import { Prisma } from "@prisma/client";
import { 여행일지_초기화 } from "./travel-notes.fixture";

export const 테이블_초기화 = async (prismaService: PrismaService, tableName: string) => {
  await prismaService.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`;
  await prismaService.$executeRaw(Prisma.sql`TRUNCATE TABLE ${Prisma.raw(tableName)}`);
  await prismaService.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`;
};

export const 전체_테이블_초기화 = async (prismaService: PrismaService) => {
  await 국가_초기화(prismaService);
  await 도시_초기화(prismaService);
  await 사용자_초기화(prismaService);
  await 여행일지_초기화(prismaService);
};
