import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/modules/core/database/prisma/prisma.service";
import { CreateAdminRequestBodyDto } from "../dtos/req/create-admin-request-body.dto";
import { TAKE_20_PER_PAGE } from "src/commons/constants/pagination.constant";
import { GetAdminsRequestBodyDto } from "src/modules/back-office/dtos/req/get-admins-request-body.dto";
import { UserEntity } from "src/modules/users/entities/user.entity";

@Injectable()
export class BackOfficeAdminService {
  constructor(private prismaService: PrismaService) {}

  createAdmin(dto: CreateAdminRequestBodyDto) {
    const { name, account } = dto;

    this.prismaService.$transaction(async transaction => {
      // account가 중복되는지 확인
      const user = await transaction.user.findFirst({
        where: {
          account: `admin-${account}`,
        },
        select: {
          id: true,
          name: true,
          account: true,
        },
      });
      if (user) {
        throw new ConflictException("이미 존재하는 관리자 유저입니다.");
      }

      const newAdminUser = await transaction.user.create({
        data: {
          name: name,
          account: `admin-${account}`,
          role: "ADMIN",
        },
      });

      return await transaction.user.findFirst({
        where: {
          id: newAdminUser.id,
        },
        select: {
          id: true,
          name: true,
          account: true,
        },
      });
    });
  }

  getAdmins(dto: GetAdminsRequestBodyDto): Promise<UserEntity[]> {
    const { cursor, name } = dto;
    return this.prismaService.user.findMany({
      take: TAKE_20_PER_PAGE,
      cursor: {
        id: cursor ?? 1,
      },
      where: {
        AND: [
          {
            role: "ADMIN",
          },
          {
            name: name,
          },
        ],
      },
      orderBy: {
        id: "desc",
      },
    });
  }
  getAdminInfo(userId: number) {
    const user = this.prismaService.user.findFirst({
      where: {
        id: userId,
      },
    });
    return user;
  }

  updateAdminInfo() {}

  deleteAdmin(userId: number) {
    const deletedAdminUser = this.prismaService.user.delete({
      where: { id: userId },
    });
    return deletedAdminUser;
  }
}
