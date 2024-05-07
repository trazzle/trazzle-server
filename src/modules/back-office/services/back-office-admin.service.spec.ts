import { Test, TestingModule } from "@nestjs/testing";
import { BackOfficeAdminService } from "./back-office-admin.service";
import { PrismaService } from "src/modules/core/database/prisma/prisma.service";

describe("BackOfficeAdminService", () => {
  let service: BackOfficeAdminService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BackOfficeAdminService],
    }).compile();

    service = module.get<BackOfficeAdminService>(BackOfficeAdminService);
  });

  describe("BackOfficeAdminService 테스트가 정의되어야한다.", () => {
    expect(service).toBeDefined();
  });

  describe("createAdmin - 관리자 계정 생성", async () => {
    
    it("");
  });
});
