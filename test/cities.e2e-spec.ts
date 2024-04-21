import { HttpStatus, INestApplication } from "@nestjs/common";
import { PrismaService } from "src/modules/core/database/prisma/prisma.service";
import { 임의사용자_생성_로그인 } from "./fixture/user.fixture";
import { 국가_생성 } from "./fixture/country.fixture";
import { 도시_생성, 도시_조회, 도시_초기화 } from "./fixture/city.fixture";
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

  describe("도시 목록 조회", () => {
    it(
      "국가 코드로 도시 목록을 조회 하면 응답 코드 200과 함께 해당 국가의 모든 도시가 반환 된다.",
      async () => {
        await 국가_생성(app, accessToken, {
          code: "JP",
          name: "일본",
          continent: "Asia",
        });
        await 도시_생성(app, accessToken, {
          name: "서울",
          countryCode: "KR",
        });
        await 도시_생성(app, accessToken, {
          name: "부산",
          countryCode: "KR",
        });
        await 도시_생성(app, accessToken, {
          name: "도쿄",
          countryCode: "JP",
        });

        const response = await 도시_조회(app, accessToken, { countryCode: "KR" });

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ name: "서울" }),
            expect.objectContaining({ name: "부산" }),
          ]),
        );
        expect(response.body).not.toEqual(expect.arrayContaining([expect.objectContaining({ name: "도쿄" })]));
      },
      1000 * 1000,
    );

    it(
      "파라미터 없이 도시 목록을 조회 하면 응답 코드 200과 함께 모든 도시가 반환 된다.",
      async () => {
        await 국가_생성(app, accessToken, {
          code: "JP",
          name: "일본",
          continent: "Asia",
        });
        await 도시_생성(app, accessToken, {
          name: "서울",
          countryCode: "KR",
        });
        await 도시_생성(app, accessToken, {
          name: "부산",
          countryCode: "KR",
        });
        await 도시_생성(app, accessToken, {
          name: "도쿄",
          countryCode: "JP",
        });

        const response = await 도시_조회(app, accessToken, {});

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ name: "서울" }),
            expect.objectContaining({ name: "부산" }),
            expect.objectContaining({ name: "도쿄" }),
          ]),
        );
      },
      1000 * 1000,
    );

    it(
      "도시명으로 도시 목록을 조회 하면 응답 코드 200과 함께 해당 도시가 반환 된다.",
      async () => {
        await 도시_생성(app, accessToken, {
          name: "서울",
          countryCode: "KR",
        });
        await 도시_생성(app, accessToken, {
          name: "부산",
          countryCode: "KR",
        });

        const response = await 도시_조회(app, accessToken, { name: "서울" });

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).toEqual(expect.arrayContaining([expect.objectContaining({ name: "서울" })]));
        expect(response.body).not.toEqual(expect.arrayContaining([expect.objectContaining({ name: "부산" })]));
      },
      1000 * 1000,
    );
  });
});
