import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/modules/core/database/prisma/prisma.service";

@Injectable()
export class BackOfficeCityService {
  constructor(private prismaService: PrismaService) {}
}
