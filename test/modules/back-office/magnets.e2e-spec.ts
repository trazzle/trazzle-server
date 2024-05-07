import { HttpStatus, INestApplication } from "@nestjs/common";
import { PrismaService } from "src/modules/core/database/prisma/prisma.service";
import { LoginResponse, 임의사용자_생성_로그인 } from "../../fixture/user.fixture";
import { 국가_생성_검증 } from "../../fixture/country.fixture";
import { 도시_생성_검증 } from "../../fixture/city.fixture";
import { initializeApp, tearDownApp } from "../../fixture/common.fixture";
import { Role } from "@prisma/client";
import { 마그넷_생성, 마그넷_초기화 } from "../../fixture/magnet.fixture";
import { CreateMagnetDto } from "src/modules/back-office/dtos/req/create-magnet.dto";

describe("백오피스 > 마그넷", () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let admin: LoginResponse;
  let countryCode;
  let cityId;

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
    await 마그넷_초기화(prismaService);
  });

  afterEach(async () => {});

  afterAll(async () => {
    await tearDownApp(app);
  });

  describe("마그넷 생성", () => {
    it(
      "존재하는 도시의 ID를 이용하여 요청하면 응답 코드 201을 반환 한다.",
      async () => {
        const dto: CreateMagnetDto = {
          cityId: cityId,
          cost: 100,
        };
        const response = await 마그넷_생성(app, admin.accessToken, dto, "dog.jpg");
        expect(response.status).toBe(HttpStatus.CREATED);
      },
      1000 * 1000,
    );

    it(
      "존재하지 않는 도시의 ID를 이용하여 요청하면 응답 코드 400을 반환 한다.",
      async () => {
        const dto: CreateMagnetDto = {
          cityId: cityId + 1,
          cost: 100,
        };
        const response = await 마그넷_생성(app, admin.accessToken, dto, "dog.jpg");
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      },
      1000 * 1000,
    );

    it(
      "이미지 파일을 포함하지 않고 요청하면 응답 코드 400을 반환 한다.",
      async () => {
        const dto: CreateMagnetDto = {
          cityId: cityId,
          cost: 100,
        };
        const response = await 마그넷_생성(app, admin.accessToken, dto, null);
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      },
      1000 * 1000,
    );

    it(
      "마그넷 가격을 입력하지 않고 요청하면 응답 코드 201을 반환 한다. (무료)",
      async () => {
        const dto: CreateMagnetDto = {
          cityId: cityId,
          cost: null,
        };
        const response = await 마그넷_생성(app, admin.accessToken, dto, "dog.jpg");
        expect(response.status).toBe(HttpStatus.CREATED);
      },
      1000 * 1000,
    );

    it(
      "마그넷 가격을 0으로 요청하면 응답 코드 201을 반환 한다. (무료)",
      async () => {
        const dto: CreateMagnetDto = {
          cityId: cityId,
          cost: 0,
        };
        const response = await 마그넷_생성(app, admin.accessToken, dto, "dog.jpg");
        expect(response.status).toBe(HttpStatus.CREATED);
      },
      1000 * 1000,
    );

    it(
      "마그넷 가격을 -100으로 요청하면 응답 코드 400을 반환 한다. (무료)",
      async () => {
        const dto: CreateMagnetDto = {
          cityId: cityId,
          cost: -100,
        };
        const response = await 마그넷_생성(app, admin.accessToken, dto, "dog.jpg");
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      },
      1000 * 1000,
    );

    it(
      "마그넷 가격을 100으로 요청하면 응답 코드 201을 반환 한다. (유료)",
      async () => {
        const dto: CreateMagnetDto = {
          cityId: cityId,
          cost: 100,
        };
        const response = await 마그넷_생성(app, admin.accessToken, dto, "dog.jpg");
        expect(response.status).toBe(HttpStatus.CREATED);
      },
      1000 * 1000,
    );
  });
});
