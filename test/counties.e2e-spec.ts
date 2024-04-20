import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { AppModule } from "./../src/app.module";
import { PrismaService } from "src/modules/core/database/prisma/prisma.service";
import { 임의사용자_생성_로그인 } from "./fixture/user.fixture";
import { 국가_생성, 국가_초기화 } from "./fixture/country.fixture";
import { 전체_테이블_초기화 } from "./fixture/common.fixture";

/**
 * https://jojoldu.tistory.com/656
 * toThrowError 참고자료
 */
describe("국가", () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prismaService = app.get<PrismaService>(PrismaService);
    const result = await 임의사용자_생성_로그인(app, prismaService);
    accessToken = result.accessToken;
  });

  beforeEach(async () => {
    await 국가_초기화(prismaService);
  });

  afterEach(async () => {});

  afterAll(async () => {
    await 전체_테이블_초기화(prismaService);
    await app.close();
  });

  describe("국가 생성", () => {
    it(
      "국가가 정상적으로 생성 된다.",
      async () => {
        const response = await 국가_생성(app, accessToken, {
          code: "KR",
          name: "대한민국",
          continent: "Asia",
        });
        expect(response.status).toBe(HttpStatus.CREATED);
        expect(response.body).toBeDefined();
      },
      1000 * 1000,
    );

    it(
      "국가 코드를 입력하지 않으면 응답 코드 400을 반환 한다.",
      async () => {
        const response = await 국가_생성(app, accessToken, {
          code: null,
          name: "대한민국",
          continent: "Asia",
        });
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      },
      1000 * 1000,
    );

    it(
      "국가명을 입력하지 않으면 응답 코드 400을 반환 한다.",
      async () => {
        const response = await 국가_생성(app, accessToken, {
          code: "KR",
          name: null,
          continent: "Asia",
        });
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      },
      1000 * 1000,
    );

    it(
      "국가 코드가 중복되면 응답 코드 409를 반환 한다.",
      async () => {
        let response = await 국가_생성(app, accessToken, {
          code: "KR",
          name: "대한민국",
          continent: "Asia",
        });
        expect(response.status).toBe(HttpStatus.CREATED);
        response = await 국가_생성(app, accessToken, {
          code: "KR",
          name: "대한민국",
          continent: "Asia",
        });
        expect(response.status).toBe(HttpStatus.CONFLICT);
      },
      1000 * 1000,
    );
  });
});
