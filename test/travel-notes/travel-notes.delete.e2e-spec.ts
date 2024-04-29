import { HttpStatus, INestApplication } from "@nestjs/common";
import { PrismaService } from "src/modules/core/database/prisma/prisma.service";
import { 임의사용자_생성_로그인 } from "../fixture/user.fixture";
import { 국가_생성 } from "../fixture/country.fixture";
import { 전체_테이블_초기화 } from "../fixture/common.fixture";
import { 도시_생성 } from "../fixture/city.fixture";
import { 여행기_삭제, 여행기_생성, 여행기_조회, 여행기_초기화 } from "../fixture/travel-notes.fixture";
import { initializeApp } from "../common.e2e-spec";
import { LocalDate } from "@js-joda/core";

describe("여행기 삭제", () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let accessToken: string;
  let userId: number;
  let cityId: number;
  let travelNoteId;

  beforeAll(async () => {
    app = await initializeApp();
    prismaService = app.get<PrismaService>(PrismaService);
    const result = await 임의사용자_생성_로그인(app, prismaService);
    accessToken = result.accessToken;
    userId = Number(result.userId);
    await 국가_생성(app, accessToken, {
      code: "KR",
      name: "대한민국",
      continent: "Asia",
    });

    const cityResponse = await 도시_생성(app, accessToken, {
      name: "서울",
      countryCode: "KR",
    });

    cityId = cityResponse.body.id;
  });

  beforeEach(async () => {
    await 여행기_초기화(prismaService);

    const response = await 여행기_생성(
      app,
      accessToken,
      {
        startDate: LocalDate.of(2024, 3, 20),
        endDate: LocalDate.of(2024, 3, 25),
        title: "서울여행",
        review: "서울여행 재밌다.",
        cityId: cityId,
        cityName: null,
        mainImageIndex: 1,
      },
      ["dog.jpg", "dog.jpg", "dog.jpg", "dog.jpg", "dog.jpg", "dog.jpg"],
    );

    expect(response.status).toBe(HttpStatus.CREATED);
    travelNoteId = response.body.id;
    expect(travelNoteId).toBeDefined();
  });

  afterAll(async () => {
    await 전체_테이블_초기화(prismaService);
    await app.close();
  });

  describe("권한", () => {
    it("사용자 본인의 여행기 삭제 요청 시 응답 코드 200을 반환 한다.", async () => {
      const response = await 여행기_삭제(app, accessToken, travelNoteId);
      expect(response.status).toBe(HttpStatus.OK);
      expect((await 여행기_조회(app, accessToken, userId)).body.length).toEqual(0);
    });

    it("다른 사용자의 여행기 삭제 요청 시 응답 코드 403을 반환 한다.", async () => {
      const otherUserAccessToken = (await 임의사용자_생성_로그인(app, prismaService)).accessToken;
      const response = await 여행기_삭제(app, otherUserAccessToken, travelNoteId);
      expect(response.status).toBe(HttpStatus.FORBIDDEN);

      expect((await 여행기_조회(app, accessToken, userId)).body.length).toEqual(1);
    });
  });
});
