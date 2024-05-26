import { IsNumber, IsString } from "class-validator";

export class UpdateAccessTokenRequestDto {
  @IsString()
  refreshToken: string | unknown;

  @IsNumber()
  userId: number;

  @IsString()
  account: string;
}
