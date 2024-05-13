import { Test, TestingModule } from "@nestjs/testing";
import { BackOfficeAdminService } from "./back-office-admin.service";
import { PrismaService } from "../../core/database/prisma/prisma.service";
import { mockPrismaService } from "test/mock/mock-prisma-service";
import { NotFoundException } from "@nestjs/common";

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
      const expectedResult = [];
      // prisma함수 호출
      prismaService.user.findMany.mockResolvedValueOnce(expectedResult);

      // 예상결과값과 비교
      expect(service.getAdmins({})).resolves.toStrictEqual([]);
    });
  });

  describe("createAdmin (관리자 생성)", () => {
    const name: string = "김트레즐";
    const account: string = "test-1234";

    it("새로운 관리자 계정을 생성한다", async () => {
      const expectedResult = {
        id: 1,
        name: name,
        account: account,
        role: "ADMIN",
        intro: null,
        profileImageUrl: null,
      };

      // prisma 함수 호출
      prismaService.user.findFirst.mockResolvedValue(null); // 초기 생성데이터 이다.
      prismaService.user.create.mockResolvedValue(expectedResult);

      // mocking transactions
      prismaService.$transaction.mockImplementation(callback => callback(prismaService));

      const result = await service.createAdmin({ name: name, account: account });
      expect(result).toStrictEqual(expectedResult);
    });

    it("전체 회원의 수는 1명이다.", () => {
      const expectedResult = [
        {
          id: 1,
          name: name,
          account: account,
          role: "ADMIN",
          intro: null,
          profileImageUrl: null,
        },
      ];

      // prisma 함수 호출
      prismaService.user.findMany.mockResolvedValue(expectedResult);
      expect(service.getAdmins({})).resolves.toStrictEqual(expectedResult);
    });

    it("id = 1 유저 검색이 성공된다", () => {
      const expectedResult = {
        id: 1,
        name: name,
        account: account,
        role: "ADMIN",
        intro: null,
        profileImageUrl: null,
      };

      // prisma 함수 호출
      prismaService.user.findFirst.mockResolvedValue(expectedResult);
      expect(service.getAdminInfo(1)).resolves.toStrictEqual(expectedResult);
    });

    it("id = 2 유저 검색은 실패된다 - 유저가 존재하지 않는다.", () => {
      expect(service.getAdminInfo(2)).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe("updateAdminInfo (관리자 정보 수정)", () => {
    const name: string = "김트레즐";
    const account: string = "test-1234";
    const temporaryUser = {
      id: 1,
      name: name,
      account: account,
      role: "ADMIN",
      intro: null,
      profileImageUrl: null,
    };

    it("임시 관리자 정보 수정에 성공한다", async () => {
      // 1. 임시로 관리자 계정을 생성한다.
      // prisma 함수 호출
      prismaService.user.findFirst.mockResolvedValue(null); // 초기 생성데이터 이다.
      prismaService.user.create.mockResolvedValue(temporaryUser);

      // mocking transactions
      prismaService.$transaction.mockImplementation(callback => callback(prismaService));
      const newAdminUser = await service.createAdmin({ name: name, account: account });
      expect(newAdminUser).toStrictEqual(temporaryUser);

      // 2. 관리자명(name) 수정한다.
      const updatedName = "이트레즐";
      const expectedResult = {
        id: 1,
        name: updatedName,
        account: account,
        role: "ADMIN",
        intro: null,
        profileImageUrl: null,
      };

      // prisma 함수 호출
      prismaService.user.findFirst.mockResolvedValue(newAdminUser); // userId = 1 인 유저 검색
      prismaService.user.update.mockResolvedValue(expectedResult);

      // mocking transactions
      prismaService.$transaction.mockImplementation(callback => callback(prismaService));
      const result = await service.updateAdminInfo({ userId: newAdminUser.id, name: updatedName });
      expect(result).toStrictEqual(expectedResult);
    });
  });
  describe("deleteAdmin (관리자 삭제)", () => {
    const name: string = "김트레즐";
    const account: string = "test-1234";
    const temporaryUser = {
      id: 1,
      name: name,
      account: account,
      role: "ADMIN",
      intro: null,
      profileImageUrl: null,
    };
    it("임시 관리자 정보 삭제에 성공한다", async () => {
      // 1. 임시로 관리자 계정을 생성한다.
      // prisma 함수 호출
      prismaService.user.findFirst.mockResolvedValue(null); // 초기 생성데이터 이다.
      prismaService.user.create.mockResolvedValue(temporaryUser);

      // mocking transactions
      prismaService.$transaction.mockImplementation(callback => callback(prismaService));
      const newAdminUser = await service.createAdmin({ name: name, account: account });
      expect(newAdminUser).toStrictEqual(temporaryUser);

      // 2. 관리자 계정을 삭제한다.
      // prisma 함수 호출
      prismaService.user.delete.mockResolvedValue();
      const result = await service.deleteAdmin(newAdminUser.id);
      expect(result).toBe(undefined);
    });

    it("삭제후 삭제된 관리자정보는 존재하지 않는다", () => {
      // prisma함수 호출
      prismaService.user.findFirst.mockResolvedValue(null);

      // mocking
      const result = service.getAdminInfo(1);
      expect(result).rejects.toBeInstanceOf(NotFoundException);
    });
    it("삭제후 관리자목록의 길이는 0 이다.", () => {
      const expectedResult = [];
      // prisma함수 호출
      prismaService.user.findMany.mockResolvedValueOnce(expectedResult);

      // mocking
      const result = service.getAdmins({});

      // 예상결과값과 비교
      expect(result).resolves.toStrictEqual([]);
      expect(result).resolves.toHaveLength(0);
    });
  });
});
