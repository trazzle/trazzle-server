import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/modules/core/database/prisma/prisma.service";
import { CreateAdminRequestBodyDto } from "../dtos/req/create-admin-request-body.dto";
import { TAKE_20_PER_PAGE } from "src/commons/constants/pagination.constant";
import { GetAdminsRequestBodyDto } from "src/modules/back-office/dtos/req/get-admins-request-body.dto";
import { UpdateAdminInfoDto } from "../dtos/req/update-admin-info-request-body.dto";

@Injectable()
export class BackOfficeAdminService {
  constructor(private prismaService: PrismaService) {}

  async createAdmin(dto: CreateAdminRequestBodyDto) {
    const { name, account } = dto;

    const result = await this.prismaService.$transaction(async tx => {
      // account가 중복되는지 확인
      const user = await tx.user.findFirst({
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

      const newAdminUser = await tx.user.create({
        data: {
          name: name,
          account: `admin-${account}`,
          role: "ADMIN",
        },
      });

      return newAdminUser;
    });

    return result;
  }

  async getAdmins(dto: GetAdminsRequestBodyDto) {
    const { cursor, name } = dto;
    const result = await this.prismaService.user.findMany({
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

    return result;
  }
  async getAdminInfo(userId: number) {
    const admin = await this.prismaService.user.findFirst({
      where: {
        id: userId,
      },
    });
    if (!admin) {
      throw new NotFoundException("존재하지 않은 관리자 회원입니다.");
    }
    return admin;
  }

  async updateAdminInfo(dto: UpdateAdminInfoDto) {
    const { userId, name } = dto;
    const result = await this.prismaService.$transaction(async tx => {
      const admin = await tx.user.findFirst({ where: { id: userId } });
      if (!admin) {
        throw new NotFoundException("존재하지 않은 관리자 회원입니다.");
      }

      const updatedUser = await tx.user.update({
        where: {
          id: userId,
        },
        data: {
          name: name ?? admin.name,
        },
      });

      return updatedUser;
    });
    return result;
  }

  async deleteAdmin(userId: number) {
    const deletedAdminUser = await this.prismaService.user.delete({
      where: { id: userId },
    });
    return deletedAdminUser;
  }
}
