import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class UpdateAccessTokenRequestDto {
  @ApiProperty({
    description: "Trazzle Refresh Token",
    required: true,
    example: "{{트래즐 서비스 리프래시토큰}}",
  })
  @IsString()
  refreshToken: string | unknown;

  @ApiProperty({
    description: "액세스토큰 페이로드 유저 식별자",
    required: true,
    example: 1,
  })
  @IsNumber()
  userId: number;

  @ApiProperty({
    description: "유저 소셜연동계정 식별자",
    required: true,
    example: "k-1234567",
  })
  @IsString()
  account: string;
}