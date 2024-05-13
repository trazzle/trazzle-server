import { PrismaService } from "src/modules/core/database/prisma/prisma.service";
import { 테이블_초기화 } from "./common.fixture";
import { Role } from "@prisma/client";

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
