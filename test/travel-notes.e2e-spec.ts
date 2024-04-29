import { HttpStatus, INestApplication } from "@nestjs/common";
import { PrismaService } from "src/modules/core/database/prisma/prisma.service";
import { 임의사용자_생성_로그인 } from "./fixture/user.fixture";
import { 국가_생성 } from "./fixture/country.fixture";
import { 전체_테이블_초기화 } from "./fixture/common.fixture";
import { 도시_생성 } from "./fixture/city.fixture";
import { 여행일지_생성, 여행일지_초기화 } from "./fixture/travel-notes.fixture";
import { initializeApp } from "./common.e2e-spec";
import { LocalDate } from "@js-joda/core";

describe("여행기", () => {
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

    cityId = (
      await 도시_생성(app, accessToken, {
        name: "서울",
        countryCode: "KR",
      })
    ).body.id;
  });

  beforeEach(async () => {
    await 여행일지_초기화(prismaService);
  });

  afterAll(async () => {
    await 전체_테이블_초기화(prismaService);
    await app.close();
  });

  describe("여행기 등록", () => {
    it("존재하는 도시에 대해 여행일지를 등록 한다.", async () => {
      const response = await 여행일지_생성(
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
    });

    it("존재 하지 않는 도시(기타) 대해 여행일지를 등록 한다.", async () => {
      const response = await 여행일지_생성(app, accessToken, {
        startDate: LocalDate.of(2024, 3, 20),
        endDate: LocalDate.of(2024, 3, 25),
        title: "서울여행",
        review: "서울여행 재밌다.",
        cityId: null,
        cityName: "한양",
        mainImageIndex: 1,
      });

      expect(response.status).toBe(HttpStatus.CREATED);
    });

    it("기타 도시 글자수가 20자가 넘으면 코드 400을 반환한다", async () => {
      const response = await 여행일지_생성(app, accessToken, {
        startDate: LocalDate.of(2024, 3, 20),
        endDate: LocalDate.of(2024, 3, 25),
        title: "기타 도시 여행",
        review: "오늘은 기타도시를 처음가봤고, 한국에 이런 이국적인 도시가 한국에 있을줄은 정말 몰랐다.",
        cityId: null,
        cityName: "city_name_have_a_long_length_logger_than_20",
        mainImageIndex: 1,
      });

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it("99개의 여행기가 존재할 때 등록 요청하면 응답 코드 200를 반환 한다.", async () => {
      const body = {
        startDate: LocalDate.of(2024, 3, 20),
        endDate: LocalDate.of(2024, 3, 25),
        title: "서울여행",
        review: "서울여행 재밌다.",
        cityId: cityId,
        cityName: null,
        mainImageIndex: 1,
      };

      await Promise.all(
        Array(99)
          .fill(true)
          .map(async () => {
            const response = await 여행일지_생성(app, accessToken, body);
            expect(response.status).toBe(HttpStatus.CREATED);
          }),
      );
      const response = await 여행일지_생성(app, accessToken, body);
      expect(response.status).toBe(HttpStatus.CREATED);
    });

    it("100개의 여행기가 존재할 때 등록 요청하면 응답 코드 409를 반환 한다.", async () => {
      const body = {
        startDate: LocalDate.of(2024, 3, 20),
        endDate: LocalDate.of(2024, 3, 25),
        title: "서울여행",
        review: "서울여행 재밌다.",
        cityId: cityId,
        cityName: null,
        mainImageIndex: 1,
      };
      await Promise.all(
        Array(100)
          .fill(true)
          .map(async () => {
            const response = await 여행일지_생성(app, accessToken, body);
            expect(response.status).toBe(HttpStatus.CREATED);
          }),
      );
      const response = await 여행일지_생성(app, accessToken, body);
      expect(response.status).toBe(HttpStatus.CONFLICT);
    });

    describe("제목", () => {
      it("제목을 입력하지 않으면 응답 코드 400을 반환 한다.", async () => {
        const response = await 여행일지_생성(app, accessToken, {
          startDate: LocalDate.of(2024, 3, 20),
          endDate: LocalDate.of(2024, 3, 25),
          title: null,
          review: "서울여행 재밌다.",
          cityId: 1,
          cityName: null,
          mainImageIndex: 1,
        });

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      });

      it("제목의 길이가 20자를 넘으면 응답 코드 400을 반환 한다.", async () => {
        const response = await 여행일지_생성(app, accessToken, {
          startDate: LocalDate.of(2024, 3, 20),
          endDate: LocalDate.of(2024, 3, 25),
          title: "1234567890_1234567890", // 21자
          review: "서울여행 재밌다.",
          cityId: 1,
          cityName: null,
          mainImageIndex: 1,
        });

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      });
    });

    describe("기간", () => {
      it("여행 시작일을 입력하지 않으면 응답 코드 400을 반환 한다.", async () => {
        const response = await 여행일지_생성(app, accessToken, {
          startDate: null,
          endDate: LocalDate.of(2024, 3, 25),
          title: "서울여행", // 21자
          review: "서울여행 재밌다.",
          cityId: 1,
          cityName: null,
          mainImageIndex: 1,
        });

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      });

      it("여행 종료일을 입력하지 않으면 응답 코드 400을 반환 한다.", async () => {
        const response = await 여행일지_생성(app, accessToken, {
          startDate: LocalDate.of(2024, 3, 20),
          endDate: null,
          title: "서울여행", // 21자
          review: "서울여행 재밌다.",
          cityId: 1,
          cityName: null,
          mainImageIndex: 1,
        });

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      });

      it("여행 시작일이 여행 종료일 이후면 응답 코드 400을 반환 한다.", async () => {
        const response = await 여행일지_생성(app, accessToken, {
          startDate: LocalDate.of(2024, 3, 26),
          endDate: LocalDate.of(2024, 3, 25),
          title: "서울여행", // 21자
          review: "서울여행 재밌다.",
          cityId: 1,
          cityName: null,
          mainImageIndex: 1,
        });

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      });

      it("여행 시작일이 여행 종료일과 같으면 응답 코드 201을 반환 한다.", async () => {
        const response = await 여행일지_생성(app, accessToken, {
          startDate: LocalDate.of(2024, 3, 25),
          endDate: LocalDate.of(2024, 3, 25),
          title: "서울여행", // 21자
          review: "서울여행 재밌다.",
          cityId: 1,
          cityName: null,
          mainImageIndex: 1,
        });

        expect(response.status).toBe(HttpStatus.CREATED);
      });
    });

    describe("감상문", () => {
      it("감상문이 280자를 초과하면 응답 코드 400을 반환 한다.", async () => {
        let review = "";
        for (let count = 0; count < 281; count++) {
          review += "가";
        }

        expect(review.length).toBe(281);

        const response = await 여행일지_생성(app, accessToken, {
          startDate: LocalDate.of(2024, 3, 25),
          endDate: LocalDate.of(2024, 3, 25),
          title: "서울여행", // 21자
          review: review,
          cityId: 1,
          cityName: null,
          mainImageIndex: 1,
        });

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      });

      it("감상문이 280자이면 응답 코드 200을 반환 한다.", async () => {
        let review = "";
        for (let count = 0; count < 280; count++) {
          review += "a";
        }

        expect(review.length).toBe(280);

        const response = await 여행일지_생성(app, accessToken, {
          startDate: LocalDate.of(2024, 3, 20),
          endDate: LocalDate.of(2024, 3, 25),
          title: "서울여행", // 21자
          review: review,
          cityId: 1,
          cityName: null,
          mainImageIndex: 1,
        });

        expect(response.status).toBe(HttpStatus.CREATED);
      });

      it("감상문을 입력하지 않으면 응답 코드 200을 반환 한다.", async () => {
        const response = await 여행일지_생성(app, accessToken, {
          startDate: LocalDate.of(2024, 3, 20),
          endDate: LocalDate.of(2024, 3, 25),
          title: "서울여행", // 21자
          review: null,
          cityId: 1,
          cityName: null,
          mainImageIndex: 1,
        });

        expect(response.status).toBe(HttpStatus.CREATED);
      });
    });

    describe("사진", () => {
      it("사진을 등록하지 않으면 응답 코드 200을 반환 한다.", async () => {
        const response = await 여행일지_생성(
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
          [],
        );

        expect(response.status).toBe(HttpStatus.CREATED);
      });

      it("사진을 6장 등록하면 응답 코드 200을 반환 한다.", async () => {
        const response = await 여행일지_생성(
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
      });

      it("사진을 등록하지 않으면 응답 코드 200을 반환 한다.", async () => {
        const response = await 여행일지_생성(
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
          ["dog.jpg", "not_image.txt"],
        );

        expect(response.status).toBe(HttpStatus.CREATED);
      });
    });
  });
});
