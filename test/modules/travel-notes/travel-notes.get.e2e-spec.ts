import { HttpStatus, INestApplication } from "@nestjs/common";
import { PrismaService } from "src/modules/core/database/prisma/prisma.service";
import { LoginResponse, 임의사용자_생성_로그인 } from "../../fixture/user.fixture";
import { 국가_생성_검증 } from "../../fixture/country.fixture";
import { initializeApp, tearDownApp } from "../../fixture/common.fixture";
import { 도시_생성_검증 } from "../../fixture/city.fixture";
import { 여행기_생성, 여행기_조회, 여행기_초기화 } from "../../fixture/travel-notes.fixture";
import { LocalDate } from "@js-joda/core";
import { Role } from "@prisma/client";

describe("여행기 조회", () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let countryCode: string;
  let cityId: number;
  let admin: LoginResponse;

  beforeAll(async () => {
    app = await initializeApp();
    prismaService = app.get<PrismaService>(PrismaService);

    admin = await 임의사용자_생성_로그인(app, prismaService, Role.ADMIN);
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
  });

  afterAll(async () => {
    await tearDownApp(app);
  });

  it("사용자의 ID로 여행기 조회 요청하면 응답 코드 200과 함께 해당 사용자의 여행기 목록을 반환 한다.", async () => {
    const { userId, accessToken } = await 임의사용자_생성_로그인(app, prismaService, Role.USER);
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
        countryCode: null,
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
    const user = await 임의사용자_생성_로그인(app, prismaService, Role.USER);

    await 여행기_생성(
      app,
      user.accessToken,
      {
        startDate: LocalDate.of(2024, 3, 20),
        endDate: LocalDate.of(2024, 3, 25),
        title: "서울여행", // 21자
        review: "서울여행 재밌다.",
        cityId: cityId,
        cityName: null,
        countryCode: null,
        mainImageIndex: 1,
      },
      ["dog.jpg"],
    );

    const otherUser = await 임의사용자_생성_로그인(app, prismaService);
    const randomUserId = Math.floor(Math.random() * 100000);
    const response = await 여행기_조회(app, otherUser.accessToken, randomUserId);
    expect(response.status).toEqual(HttpStatus.OK);
    const travelNotes = response.body;
    expect(travelNotes.length).toEqual(0);
  });
});
