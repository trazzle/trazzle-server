import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/modules/core/database/prisma/prisma.service";
import { RedisService } from "src/modules/core/redis/redis.service";
import { Request } from "express";
import { CustomConfigService } from "src/modules/core/config/custom-config.service";
import ENV_KEY from "src/modules/core/config/constants/env-config.constant";

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly prismaService: PrismaService,
    private readonly customConfigService: CustomConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    try {
      const inputAdminBearerToken = this.extractTokenFromHeader(request);
      if (!inputAdminBearerToken) {
        throw new UnauthorizedException("토큰이 만료되었습니다.");
      }

      const payload = await this.jwtService.verifyAsync(inputAdminBearerToken, {
        secret: this.customConfigService.get(ENV_KEY.JWT_SECRET_KEY),
      });

      const { userId, account } = payload;
      const user = await this.prismaService.user.findFirst({
        where: {
          account: account,
          id: userId,
        },
      });

      if (!user) {
        throw new NotFoundException("존재하지 않은 회원입니다.");
      }

      return user.role === "ADMIN";
    } catch (error) {
      throw error;
    }
  }

  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
