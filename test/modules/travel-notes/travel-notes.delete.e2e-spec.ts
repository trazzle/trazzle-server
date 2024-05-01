import { HttpStatus, INestApplication } from "@nestjs/common";
import { PrismaService } from "src/modules/core/database/prisma/prisma.service";
import { LoginResponse, 임의사용자_생성_로그인 } from "../../fixture/user.fixture";
import { 국가_생성_검증 } from "../../fixture/country.fixture";
import { initializeApp, tearDownApp } from "../../fixture/common.fixture";
import { 도시_생성_검증 } from "../../fixture/city.fixture";
import { 여행기_삭제, 여행기_생성, 여행기_조회, 여행기_초기화 } from "../../fixture/travel-notes.fixture";
import { LocalDate } from "@js-joda/core";
import { Role } from "@prisma/client";

describe("여행기 삭제", () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let countryCode: string;
  let cityId: number;
  let admin: LoginResponse;
  let user: LoginResponse;
  let travelNoteId;

  beforeAll(async () => {
    app = await initializeApp();
    prismaService = app.get<PrismaService>(PrismaService);

    admin = await 임의사용자_생성_로그인(app, prismaService, Role.ADMIN);
    user = await 임의사용자_생성_로그인(app, prismaService, Role.USER);
    countryCode = await 국가_생성_검증(app, admin.accessToken, {
      code: "KR",
      name: "대한민국",
      continent: "Asia",
    });
    cityId = await 도시_생성_검증(app, admin.accessToken, {
      name: "서울",
      countryCode,
    });
  });

  beforeEach(async () => {
    await 여행기_초기화(prismaService);

    const response = await 여행기_생성(
      app,
      user.accessToken,
      {
        startDate: LocalDate.of(2024, 3, 20),
        endDate: LocalDate.of(2024, 3, 25),
        title: "서울여행",
        review: "서울여행 재밌다.",
        cityId: cityId,
        cityName: null,
        countryCode: null,
        mainImageIndex: 1,
      },
      ["dog.jpg", "dog.jpg", "dog.jpg", "dog.jpg", "dog.jpg", "dog.jpg"],
    );

    expect(response.status).toBe(HttpStatus.CREATED);
    travelNoteId = response.body.id;
    expect(travelNoteId).toBeDefined();
  });

  afterAll(async () => {
    await tearDownApp(app);
  });

  describe("권한", () => {
    it("사용자 본인의 여행기 삭제 요청 시 응답 코드 200을 반환 한다.", async () => {
      const response = await 여행기_삭제(app, user.accessToken, travelNoteId);
      expect(response.status).toBe(HttpStatus.OK);
      expect((await 여행기_조회(app, user.accessToken, user.userId)).body.length).toEqual(0);
    });

    it("다른 사용자의 여행기 삭제 요청 시 응답 코드 403을 반환 한다.", async () => {
      const otherUserAccessToken = (await 임의사용자_생성_로그인(app, prismaService)).accessToken;
      const response = await 여행기_삭제(app, otherUserAccessToken, travelNoteId);
      expect(response.status).toBe(HttpStatus.FORBIDDEN);

      expect((await 여행기_조회(app, user.accessToken, user.userId)).body.length).toEqual(1);
    });
  });
});
