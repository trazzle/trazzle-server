import { INestApplication } from "@nestjs/common";
import { PrismaService } from "src/modules/core/database/prisma/prisma.service";
import { UserEntity } from "src/modules/users/entities/user.entity";
import { 사용자_로그인, 사용자_삭제, 사용자_생성 } from "./fixture/user.fixture";
import { v4 } from "uuid";
import { initializeApp } from "./common.e2e-spec";

describe("사용자 & 로그인", () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let user: UserEntity;

  beforeAll(async () => {
    app = await initializeApp();
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
