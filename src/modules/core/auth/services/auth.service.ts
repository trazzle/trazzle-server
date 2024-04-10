import { Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import TrazzleJwtPayload from "src/modules/core/auth/jwt/trazzle-jwt.payload";
import ENV_KEY from "src/modules/core/config/constants/env-config.constant";
import { CustomConfigService } from "src/modules/core/config/custom-config.service";
import { RedisService } from "src/modules/core/redis/redis.service";
import { SignInOrSignUpRequestBodyDto } from "src/modules/users/dtos/req/sign-in-sign-up-request-body.dto";
import { PrismaService } from "../../database/prisma/prisma.service";
import { AuthHelper } from "../helpers/auth.helper";

@Injectable()
export class AuthService {
  private JWT_ACCESS_TOKEN_EXPIRATION_TTL: number;
  private JWT_REFRESH_TOKEN_EXPIRATION_TTL: number;
  constructor(
    private readonly prismaService: PrismaService,
    private readonly customConfigService: CustomConfigService,

    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly authHelper: AuthHelper,
  ) {
    this.JWT_ACCESS_TOKEN_EXPIRATION_TTL = +this.customConfigService.get(ENV_KEY.JWT_ACCESS_TOKEN_EXPIRATION_TTL);
    this.JWT_REFRESH_TOKEN_EXPIRATION_TTL = +this.customConfigService.get(ENV_KEY.JWT_REFRESH_TOKEN_EXPIRATION_TTL);
  }
  async signOut(userId: number) {
    try {
      // access 토큰을 찾아서 삭제한다.
      const key = `user-${userId}`;
      await this.redisService.del(key);
    } catch (e) {
      throw e;
    }
  }

  async createRefreshToken(payload: TrazzleJwtPayload) {
    try {
      const { userId } = payload;

      // 리프래시토큰을 발급한다.
      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: this.customConfigService.get(ENV_KEY.JWT_REFRESH_SECRET_KEY),
        expiresIn: this.customConfigService.get(ENV_KEY.JWT_REFRESH_TOKEN_EXPIRATION),
      });

      // redis에 등록
      await this.redisService.set(`user-${userId}-refresh`, refreshToken, this.JWT_REFRESH_TOKEN_EXPIRATION_TTL);
      return refreshToken;
    } catch (e) {
      throw e;
    }
  }

  async createAccessToken(payload: TrazzleJwtPayload) {
    try {
      const { userId } = payload;

      // 액세스 토큰을 발급한다.
      const accessToken = await this.jwtService.signAsync(payload);

      // redis에 등록
      await this.redisService.set(`user-${userId}`, accessToken, this.JWT_ACCESS_TOKEN_EXPIRATION_TTL);

      return accessToken;
    } catch (e) {
      throw e;
    }
  }

  async signInAccount(account: string) {
    const user = await this.prismaService.user.findFirst({
      where: { account },
    });

    if (!user) {
      throw new NotFoundException("존재하지 않는 회원입니다.");
    }

    const access_token = await this.createAccessToken({
      userId: user.id,
      account: account,
    });

    const refresh_token = await this.createRefreshToken({
      userId: user.id,
      account: account,
    });

    return {
      id: user.id,
      name: user.name,
      account: user.account,
      profileImageURL: user.profileImageURL,
      intro: user.intro,
      access_token: access_token,
      refresh_token: refresh_token,
    };
  }
}
