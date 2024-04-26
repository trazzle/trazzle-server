import { IsNotEmpty, IsString } from "class-validator";

export class CreateAdminRequestBodyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  account: string;
}
