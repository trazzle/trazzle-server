import { ApiProperty } from "@nestjs/swagger";

export class UpdateAccessTokenResponseDto {
  @ApiProperty({
    description: "새로 갱신된 Trazzle 서비스 액세스토큰",
  })
  access_token: string;
}
