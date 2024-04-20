import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "./../src/app.module";
import { PrismaService } from "src/modules/core/database/prisma/prisma.service";
import { UserEntity } from "src/modules/users/entities/user.entity";
import { 사용자_로그인, 사용자_삭제, 사용자_생성 } from "./fixture/user.fixture";
import { v4 } from "uuid";

describe("사용자 & 로그인", () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let user: UserEntity;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prismaService = app.get<PrismaService>(PrismaService);
    user = await 사용자_생성(prismaService, v4());
  });

  beforeEach(async () => {});

  afterEach(async () => {
    // await prismaService.$executeRaw`ROLLBACK;`; // 테스트 후 롤백 실행
  });

  afterAll(async () => {
    await 사용자_삭제(prismaService, user.id);
    await app.close();
  });

  describe("로그인 (테스트용)", () => {
    it("로그인에 정상적으로 성공 한다.", async () => {
      await 사용자_로그인(app, user.account);
    });
  });
});
