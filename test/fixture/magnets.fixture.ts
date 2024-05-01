import { Prisma } from "@prisma/client";
import { PrismaService } from "src/modules/core/database/prisma/prisma.service";
import { 테이블_초기화 } from "./common.fixture";

const { sql, raw } = Prisma;

export const 마그넷_초기화 = async (prismaService: PrismaService) => {
  await 테이블_초기화(prismaService, "Magnet");
};

export const 마그넷_생성 = async (prismaService: PrismaService, url: string, cityId: number) => {
  await prismaService.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`;
  await prismaService.$executeRaw(
    sql`INSERT INTO Magnet (url, cityId) values (${raw(url)}, ${raw(cityId.toString())})`,
  );
  await prismaService.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`;
};
