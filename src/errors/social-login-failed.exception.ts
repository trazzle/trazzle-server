import { UnauthorizedException } from "@nestjs/common";

export class SocialLoginFailedException extends UnauthorizedException {
  constructor(message: string) {
    super();
    this.message = message;
  }
}
