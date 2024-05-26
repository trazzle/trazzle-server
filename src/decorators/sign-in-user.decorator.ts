import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { LoginSucceedUserResponseDto } from "src/modules/users/dtos/res/login-succeed-user-response.dto";

export const SignInUser = createParamDecorator((data: keyof LoginSucceedUserResponseDto, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();

  return req.user[data] || req.user;
});
