import { HttpStatus, UseGuards, applyDecorators } from "@nestjs/common";
import { ApiBearerAuth, ApiHeader } from "@nestjs/swagger";
import { ApiFailureResponse } from "src/decorators/api-failure-response.decorator";
import { AdminGuard } from "src/guards/admin-auth.guard";

export const AdminBearerAuth = (guard: any = AdminGuard) => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiHeader({
      name: "admin accessToken",
      required: true,
      description: "Trazzle Admin Access Token (Sign-In Required)",
      example:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImFjY291bnQiOiJrLWNobGRtc3JrZCIsImlhdCI6MTcxMTc5MTU2MCwiZXhwIjoxNzExODc3OTYwfQ.qNeh3LJTjMsNitv8wU76EdqjRzScyQdZfWodm1SPcSM",
    }),
    ApiFailureResponse(HttpStatus.UNAUTHORIZED, "접근이 불가능합니다."),
    UseGuards(guard),
  );
};
