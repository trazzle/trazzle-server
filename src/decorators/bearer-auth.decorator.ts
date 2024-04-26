import { applyDecorators, HttpStatus, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiHeader } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { ApiFailureResponse } from "./api-failure-response.decorator";

export const BearerAuth = (guard: any = JwtAuthGuard) => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiHeader({
      name: "user accessToken",
      required: true,
      description: "Trazzle User Access Token (Sign-In Required)",
      example:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImFjY291bnQiOiJrLWNobGRtc3JrZCIsImlhdCI6MTcxMTc5MTU2MCwiZXhwIjoxNzExODc3OTYwfQ.qNeh3LJTjMsNitv8wU76EdqjRzScyQdZfWodm1SPcSM",
    }),
    ApiFailureResponse(HttpStatus.UNAUTHORIZED, "액세스 토큰이 유효하지 않습니다."),
    UseGuards(guard),
  );
};
