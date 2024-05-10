import { Test, TestingModule } from "@nestjs/testing";
import { BackOfficeAdminService } from "./back-office-admin.service";
import { PrismaService } from "../../core/database/prisma/prisma.service";
import { mockPrismaService } from "test/mock/mock-prisma-service";

describe("BackOfficeAdminService", () => {
  let prismaService;
  let service: BackOfficeAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BackOfficeAdminService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<BackOfficeAdminService>(BackOfficeAdminService);
    prismaService = mockPrismaService;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("BackOfficeAdminService 테스트가 정의되어야한다.", () => {
    expect(service).toBeDefined();
  });
  describe("getAdmins (관리자 리스트 조회)", () => {
    it("관리자 데이터가 없는 경우에 빈배열을 리턴한다.", async () => {
      // prisma함수 호출
      prismaService.user.findMany.mockResolvedValueOnce([]);

      // 예상결과값과 비교
      expect(service.getAdmins({})).resolves.toStrictEqual([]);
    });
  });

  describe("createAdmin (관리자 생성)", () => {
    const name: string = "김트레즐";
    const account: string = "test-1234";

    it("새로운 관리자 계정을 생성한다", async () => {
      const expectedNewAdminUser = {
        id: 1,
        name: name,
        account: account,
        role: "ADMIN",
        intro: null,
        profileImageUrl: null,
      };

      // prisma 함수 호출
      prismaService.user.findFirst.mockResolvedValue(null); // 초기 생성데이터 이다.
      prismaService.user.create.mockResolvedValue(expectedNewAdminUser);

      // mocking transactions
      prismaService.$transaction.mockImplementation(callback => callback(prismaService));

      const result = await service.createAdmin({ name: name, account: account });
      await expect(result).toStrictEqual(expectedNewAdminUser);
    });
  });
});
