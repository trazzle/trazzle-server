import { HttpStatus, INestApplication } from "@nestjs/common";
import { PrismaService } from "src/modules/core/database/prisma/prisma.service";
import { 임의사용자_생성_로그인 } from "../fixture/user.fixture";
import { 국가_생성 } from "../fixture/country.fixture";
import { 전체_테이블_초기화 } from "../fixture/common.fixture";
import { 도시_생성 } from "../fixture/city.fixture";
import { 여행기_생성, 여행기_조회, 여행기_초기화 } from "../fixture/travel-notes.fixture";
import { initializeApp } from "../common.e2e-spec";
import { LocalDate } from "@js-joda/core";

describe("여행기 조회", () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let accessToken: string;
  let cityId: number;

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

    const cityResponse = await 도시_생성(app, accessToken, {
      name: "서울",
      countryCode: "KR",
    });

    cityId = cityResponse.body.id;
  });

  beforeEach(async () => {
    await 여행기_초기화(prismaService);
  });

  afterAll(async () => {
    await 전체_테이블_초기화(prismaService);
    await app.close();
  });

  it("사용자의 ID로 여행기 조회 요청하면 응답 코드 200과 함께 해당 사용자의 여행기 목록을 반환 한다.", async () => {
    const { userId, accessToken } = await 임의사용자_생성_로그인(app, prismaService);
    await 여행기_생성(
      app,
      accessToken,
      {
        startDate: LocalDate.of(2024, 3, 20),
        endDate: LocalDate.of(2024, 3, 25),
        title: "서울여행", // 21자
        review: "서울여행 재밌다.",
        cityId: cityId,
        cityName: null,
        mainImageIndex: 1,
      },
      ["dog.jpg"],
    );

    const response = await 여행기_조회(app, accessToken, userId);
    expect(response.status).toEqual(HttpStatus.OK);
    const travelNotes = response.body;
    expect(travelNotes[0].id).toBeDefined();
    expect(travelNotes[0].title).toEqual("서울여행");
    expect(travelNotes[0].startDate).toEqual("2024-03-20");
    expect(travelNotes[0].endDate).toEqual("2024-03-25");
    expect(travelNotes[0].review).toEqual("서울여행 재밌다.");
    expect(travelNotes[0].city.id).toEqual(cityId);
    expect(travelNotes[0].userId).toEqual(userId);
    expect(travelNotes[0].images.length).toEqual(1);
    expect(travelNotes[0].images[0].isMain).toEqual(true);
  });

  it("존재 하지 않는 사용자의 ID로 여행기 조회 요청하면 응답 코드 200과 함께 빈 리스트를 반환 한다.", async () => {
    const { accessToken } = await 임의사용자_생성_로그인(app, prismaService);
    await 여행기_생성(
      app,
      accessToken,
      {
        startDate: LocalDate.of(2024, 3, 20),
        endDate: LocalDate.of(2024, 3, 25),
        title: "서울여행", // 21자
        review: "서울여행 재밌다.",
        cityId: cityId,
        cityName: null,
        mainImageIndex: 1,
      },
      ["dog.jpg"],
    );
    const randomUserId = Math.floor(Math.random() * 100000);
    const response = await 여행기_조회(app, accessToken, randomUserId);
    expect(response.status).toEqual(HttpStatus.OK);
    const travelNotes = response.body;
    expect(travelNotes.length).toEqual(0);
  });
});
