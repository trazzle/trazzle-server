import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import TrazzleJwtPayload from "src/modules/core/auth/jwt/trazzle-jwt.payload";
import ENV_KEY from "src/modules/core/config/constants/env-config.constant";
import { CustomConfigService } from "src/modules/core/config/custom-config.service";
import { RedisService } from "src/modules/core/redis/redis.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { UpdateAccessTokenRequestDto } from "src/modules/users/dtos/req/update-access-token-request.dto";
import { UpdateAccessTokenResponseDto } from "src/modules/users/dtos/res/update-access-token-response.dto";

@Injectable()
export class AuthService {
  private JWT_ACCESS_TOKEN_EXPIRATION_TTL: number;
  private JWT_REFRESH_TOKEN_EXPIRATION_TTL: number;
  constructor(
    private readonly prismaService: PrismaService,
    private readonly customConfigService: CustomConfigService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {
    this.JWT_ACCESS_TOKEN_EXPIRATION_TTL = +this.customConfigService.get(ENV_KEY.JWT_ACCESS_TOKEN_EXPIRATION_TTL);
    this.JWT_REFRESH_TOKEN_EXPIRATION_TTL = +this.customConfigService.get(ENV_KEY.JWT_REFRESH_TOKEN_EXPIRATION_TTL);
  }
  async signOut(userId: number) {
    try {
      // access 토큰을 찾아서 삭제한다.
      const key = `user-${userId}`;
      await this.redisService.del(key);

      // 리프래시토큰 삭제
      await this.redisService.del(`user-${userId}-refresh`);
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

  async updateAccessToken(dto: UpdateAccessTokenRequestDto): Promise<UpdateAccessTokenResponseDto> {
    const { refreshToken, userId, account } = dto;
    try {
      // userId와 account에 해당하는 유저가 있는지 확인
      const user = await this.prismaService.user.findFirst({
        where: {
          id: userId,
          account: account,
        },
      });
      if (!user) {
        throw new NotFoundException("존재하지 않은 유저입니다.");
      }

      // refreshToken이 레디스에 유효한지 확인
      const refreshTokenFromRedis = await this.redisService.get(`user-${userId}-refresh`);
      if (refreshTokenFromRedis !== refreshToken) {
        throw new UnauthorizedException("리프래시토큰이 만료하였습니다.");
      }

      // 액세스토큰 갱신
      const newAccessToken = await this.createAccessToken({
        userId: userId,
        account: account,
      });

      return {
        access_token: newAccessToken,
      };
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
