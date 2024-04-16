import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "./../src/app.module";
import { PrismaService } from "src/modules/core/database/prisma/prisma.service";
import { UserEntity } from "src/modules/users/entities/user.entity";
import { 사용자_로그인, 사용자_삭제, 사용자_생성 } from "./fixture/user.fixture";
import { 국가_생성, 국가_초기화 } from "./fixture/country.fixture";

/**
 * https://jojoldu.tistory.com/656
 * toThrowError 참고자료
 */
describe("국가", () => {

  let app: INestApplication;
  let prismaService: PrismaService;
  let user: UserEntity;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prismaService = app.get<PrismaService>(PrismaService);
    user = await 사용자_생성(prismaService, 'test-user');
    accessToken = await 사용자_로그인(app, 'test-user');
  });

  beforeEach(async () => {
    await 국가_초기화(prismaService);
  });

  afterEach(async () => {

  });

  afterAll(async () => {
    await 국가_초기화(prismaService);
    await 사용자_삭제(prismaService, user.id);
    await app.close();
  });

  describe('국가 생성', () => {

    it("국가가 정상적으로 생성 된다.", async () => {
      const body = {
        code: 'KR',
        name: '대한민국',
        continent: 'Asia',
      };
      const response = await 국가_생성(app, accessToken, body);
      expect(response.status).toBe(201);
      expect(response.body).toBeDefined();
    });

    it('국가 코드를 입력하지 않으면 오류가 발생 한다.', async () => {
      const body = {
        code: null,
        name: '대한민국',
        continent: 'Asia',
      }
      const response = await 국가_생성(app, accessToken, body);
      expect(response.status).toBe(400);
    });

    it('국가명을 입력하지 않으면 오류가 발생 한다.', async () => {
      const body = {
        code: 'KR',
        name: null,
        continent: 'Asia',
      }
      const response = await 국가_생성(app, accessToken, body);
      expect(response.status).toBe(400);
    });
  });

});
