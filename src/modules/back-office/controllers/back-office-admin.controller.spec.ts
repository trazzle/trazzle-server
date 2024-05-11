import { Test, TestingModule } from "@nestjs/testing";
import { BackOfficeAdminController } from "./back-office-admin.controller";
import { BackOfficeAdminService } from "../services/back-office-admin.service";
import {
  mockBackOfficeAdminService,
  mockCustomConfigService,
  mockJwtService,
  mockRedisService,
} from "test/mock/mock-services";
import { CustomConfigService } from "src/modules/core/config/custom-config.service";
import { JwtService } from "@nestjs/jwt";
import { RedisService } from "src/modules/core/redis/redis.service";
import { PrismaService } from "src/modules/core/database/prisma/prisma.service";
import { mockPrismaService } from "test/mock/mock-prisma-service";

describe("BackOfficeAdminController", () => {
  let controller: BackOfficeAdminController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BackOfficeAdminController],
      providers: [
        {
          provide: CustomConfigService,
          useValue: mockCustomConfigService,
        },
        {
          provide: BackOfficeAdminService,
          useValue: mockBackOfficeAdminService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    controller = module.get<BackOfficeAdminController>(BackOfficeAdminController);
  });

  it("BackOfficeAdminController 테스트가 정의되어야한다.", () => {
    expect(controller).toBeDefined();
  });
});
