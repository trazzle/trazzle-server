import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/modules/core/database/prisma/prisma.service";
import { CreateAdminRequestBodyDto } from "../dtos/req/create-admin-request-body.dto";

@Injectable()
export class BackOfficeAdminService {
  constructor(private prismaService: PrismaService) {}

  createAdmin(dto: CreateAdminRequestBodyDto) {
    const { name, account } = dto;

    this.prismaService.$transaction(async transaction => {
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
}
