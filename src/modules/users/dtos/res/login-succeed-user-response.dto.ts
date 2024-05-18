export class LoginSucceedUserResponseDto {
  user_id: number;
  name: string;
  intro: string;
  profile_image: string;
}

/**
 * - 임시로그인
 * - 소셜로그인
 * - 관리자 로그인
 */
export class LoginSucceedUserWithTokenResponseDto extends LoginSucceedUserResponseDto {
  access_token: string;
  refresh_token: string;
}
