import { IsOptional, IsString } from "class-validator";

export class UpdateUserRequestBodyDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  intro?: string;

  @IsOptional()
  profileImageFile?: Express.Multer.File;
}
