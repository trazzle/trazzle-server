import { UnauthorizedException } from "@nestjs/common";

export class AccessTokenExpiredException extends UnauthorizedException {
  constructor() {
    super();
    this.message = "액세스 토큰이 만료되었습니다.";
  }
}
