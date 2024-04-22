import { HttpStatus, INestApplication } from "@nestjs/common";
import { PrismaService } from "src/modules/core/database/prisma/prisma.service";
import { 임의사용자_생성_로그인 } from "./fixture/user.fixture";
import { 국가_생성 } from "./fixture/country.fixture";
import { 도시_생성, 도시_초기화 } from "./fixture/city.fixture";
import { 전체_테이블_초기화 } from "./fixture/common.fixture";
import { initializeApp } from "./common.e2e-spec";

/**
 * https://jojoldu.tistory.com/656
 * toThrowError 참고자료
 */
describe("도시", () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let accessToken: string;

  beforeAll(async () => {
    app = await initializeApp();
    prismaService = app.get<PrismaService>(PrismaService);
    const result = await 임의사용자_생성_로그인(app, prismaService);
    accessToken = result.accessToken;
    await 국가_생성(app, accessToken, {
      code: "KR",
      name: "대한민국",
      continent: "Asia",
    });
  });

  beforeEach(async () => {
    await 도시_초기화(prismaService);
  });

  afterEach(async () => {});

  afterAll(async () => {
    await 전체_테이블_초기화(prismaService);
    await app.close();
  });

  describe("도시 생성", () => {
    it(
      "도시가 정상적으로 생성 된다.",
      async () => {
        const response = await 도시_생성(app, accessToken, {
          name: "대한민국",
          countryCode: "KR",
        });
        expect(response.status).toBe(HttpStatus.CREATED);
        expect(response.body).toBeDefined();
      },
      1000 * 1000,
    );

    it(
      "도시명을 입력하지 않으면 응답 코드 400을 반환 한다.",
      async () => {
        const response = await 도시_생성(app, accessToken, {
          name: null,
          countryCode: "KR",
        });
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      },
      1000 * 1000,
    );

    it(
      "국가 코드를 입력하지 않으면 응답 코드 400을 반환 한다.",
      async () => {
        const response = await 도시_생성(app, accessToken, {
          name: "대한민국",
          countryCode: null,
        });
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      },
      1000 * 1000,
    );
  });
});
