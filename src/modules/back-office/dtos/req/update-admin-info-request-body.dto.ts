import { PickType } from "@nestjs/mapped-types";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { CreateAdminRequestBodyDto } from "src/modules/back-office/dtos/req/create-admin-request-body.dto";
import { IsNotBlank } from "src/validator/is-not-blank";

export class UpdateAdminInfoRequestBodyDto extends PickType(CreateAdminRequestBodyDto, ["name"]) {}
export class UpdateAdminInfoDto extends UpdateAdminInfoRequestBodyDto {
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsString()
  @IsNotBlank()
  name: string;
}
