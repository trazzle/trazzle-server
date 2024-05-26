import { IsString } from "class-validator";
import { OAuthSocialLoginType } from "src/modules/core/auth/constants/oauth.constant";

export class SignInOrSignUpRequestBodyDto {
  @IsString()
  accessToken: string;

  oauthProvider: OAuthSocialLoginType;
}

export class SignInOrSignUpKakaoRequestBodyDto extends SignInOrSignUpRequestBodyDto {
  @IsString()
  accessToken: string;

  oauthProvider: OAuthSocialLoginType;
}

export class SignInOrSignUpAppleRequestBodyDto extends SignInOrSignUpRequestBodyDto {
  @IsString()
  accessToken: string;

  oauthProvider: OAuthSocialLoginType;
}

export class SignInOrSignUpGoogleRequestBodyDto extends SignInOrSignUpRequestBodyDto {
  @IsString()
  accessToken: string;

  oauthProvider: OAuthSocialLoginType;
}
