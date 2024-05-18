import { HttpService } from "@nestjs/axios";
import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { OAuthSocialLoginType } from "../constants/oauth.constant";
import { SignInOrSignUpRequestBodyDto } from "src/modules/users/dtos/req/sign-in-sign-up-request-body.dto";
import { AuthService } from "../services/auth.service";
import { GOOGLE_OAUTH_CLIENT_TOKEN, JWK_CLIENT_TOKEN } from "../constants/auth.constant";
import jwt, { Jwt, JwtPayload } from "jsonwebtoken";
import { OAuth2Client, TokenInfo } from "google-auth-library";
import JwksRsa, { SigningKey } from "jwks-rsa";
import { PrismaService } from "../../database/prisma/prisma.service";
import { firstValueFrom } from "rxjs";
import { SocialLoginFailedException } from "src/errors/social-login-failed.exception";

@Injectable()
export class AuthHelper {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly httpService: HttpService,
    private readonly authService: AuthService,
    @Inject(JWK_CLIENT_TOKEN)
    private readonly jwksClient: JwksRsa.JwksClient,
    @Inject(GOOGLE_OAUTH_CLIENT_TOKEN)
    private readonly googleOAuthClient: OAuth2Client,
  ) {}

  async signingWithSocial(dto: SignInOrSignUpRequestBodyDto) {
    try {
      const { oauthProvider, accessToken } = dto;
      let account, name, profileImageURL;

      switch (oauthProvider) {
        case "k":
          {
            // kakao
            // 받은 토큰으로 회원정보 갖고오기
            const userInfoKakao = await firstValueFrom(
              this.httpService.get(`https://kapi.kakao.com/v2/user/me`, {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }),
            );

            if (
              !userInfoKakao ||
              !userInfoKakao.data ||
              !userInfoKakao.data.kakao_account ||
              !userInfoKakao.data.properties
            ) {
              throw new NotFoundException("존재하지 않은 회원입니다.");
            }

            // account 값이 해당되는 유저데이터 로우가 존재하는지 확인한다.
            const { nickname, profile_image } = userInfoKakao.data.properties;
            const { id } = userInfoKakao.data;
            account = `${OAuthSocialLoginType.Kakao}-${id}`;
            name = nickname;
            profileImageURL = profile_image;
          }
          break;

        case "g":
          {
            // google
            const googleToken: TokenInfo = await this.googleOAuthClient.getTokenInfo(accessToken);
            account = `${OAuthSocialLoginType.Google}-${googleToken.aud}`;
            name = `google-user-${googleToken.email}`;
            profileImageURL = null;
          }
          break;

        case "a":
          {
            // apple
            // jwt 토큰 디코드
            const decodedJWT: Jwt | null = jwt.decode(accessToken, {
              complete: true,
            });

            if (!decodedJWT?.header?.kid) {
              throw new UnauthorizedException("유효하지 않은 토큰입니다.");
            }

            // 공개키
            const applePublicKey: SigningKey = await this.jwksClient.getSigningKey(decodedJWT.header.kid);

            const appleSignedKey: string = applePublicKey.getPublicKey();

            const { payload }: JwtPayload = jwt.verify(accessToken, appleSignedKey, {
              complete: true,
            });

            if (!payload.nonce_supported || payload.iss !== "https://appleid.apple.com") {
              throw new UnauthorizedException("유효하지 않은 토큰입니다.");
            }

            account = `${OAuthSocialLoginType.Apple}-${payload.sub}`;
            name = `apple-user-${payload.sub}`;
            profileImageURL = null;
          }
          break;
        default:
          throw new BadRequestException("잘못된 소셜로그인 프로바이더입니다.");
      }

      // 트래즐서비스에 가입되어있는지 확인
      let user = await this.prismaService.user.findFirst({
        where: { account },
      });
      if (!user) {
        // account 값이 해당하는 유저 데이터로우가 존재하지 않음 -> 등록
        user = await this.prismaService.user.create({
          data: {
            account: account,
            name: name,
            profileImageURL: profileImageURL ?? null,
            intro: null,
          },
        });
      }

      // 레디스에 액세스 토큰 등록
      const _accessToken = await this.authService.createAccessToken({
        userId: user.id,
        account: account,
      });

      // 레디스에 리프래시 토큰 등록
      const _refreshToken = await this.authService.createRefreshToken({
        userId: user.id,
        account: account,
      });

      return {
        ...user,
        accessToken: _accessToken,
        refreshToken: _refreshToken,
      };
    } catch (e) {
      if (e instanceof UnauthorizedException) {
        throw new SocialLoginFailedException("소셜 연동로그인에 실패하였습니다.");
      }
      throw e;
    }
  }
}
