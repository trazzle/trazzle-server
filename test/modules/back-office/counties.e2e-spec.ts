import { HttpStatus, INestApplication } from "@nestjs/common";
import { PrismaService } from "src/modules/core/database/prisma/prisma.service";
import { LoginResponse, 임의사용자_생성_로그인 } from "../../fixture/user.fixture";
import { 국가_생성, 국가_조회, 국가_초기화 } from "../../fixture/country.fixture";
import { initializeApp, tearDownApp } from "../../fixture/common.fixture";
import { Role } from "@prisma/client";

/**
 * https://jojoldu.tistory.com/656
 * toThrowError 참고자료
 */
describe("국가", () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let admin: LoginResponse;

  beforeAll(async () => {
    app = await initializeApp();
    prismaService = app.get<PrismaService>(PrismaService);
    admin = await 임의사용자_생성_로그인(app, prismaService, Role.ADMIN);
  });

  beforeEach(async () => {
    await 국가_초기화(prismaService);
  });

  afterEach(async () => {});

  afterAll(async () => {
    await tearDownApp(app);
  });

  describe("국가 생성", () => {
    it(
      "국가가 정상적으로 생성 된다.",
      async () => {
        const response = await 국가_생성(app, admin.accessToken, {
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
        const response = await 국가_생성(app, admin.accessToken, {
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
        const response = await 국가_생성(app, admin.accessToken, {
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
        let response = await 국가_생성(app, admin.accessToken, {
          code: "KR",
          name: "대한민국",
          continent: "Asia",
        });
        expect(response.status).toBe(HttpStatus.CREATED);
        response = await 국가_생성(app, admin.accessToken, {
          code: "KR",
          name: "대한민국",
          continent: "Asia",
        });
        expect(response.status).toBe(HttpStatus.CONFLICT);
      },
      1000 * 1000,
    );
  });

  describe("국가 목록 조회", () => {
    it(
      "국가 생성 후, 국가 목록 조회하면 응답 코드 200과 함께 해당 국가가 포함된 리스트가 반환 된다.",
      async () => {
        await 국가_생성(app, admin.accessToken, {
          code: "KR",
          name: "대한민국",
          continent: "Asia",
        });

        const response = await 국가_조회(app, admin.accessToken);

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              code: "KR",
            }),
          ]),
        );
        expect(response.body).not.toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              code: "JP",
            }),
          ]),
        );
      },
      1000 * 1000,
    );
  });
});
