import { PickType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { CreateAdminRequestBodyDto } from "src/modules/back-office/dtos/req/create-admin-request-body.dto";
import { IsNotBlank } from "src/validator/is-not-blank";

export class UpdateAdminInfoRequestBodyDto extends PickType(CreateAdminRequestBodyDto, ["name"]) {}
export class UpdateAdminInfoDto extends UpdateAdminInfoRequestBodyDto {
  @ApiProperty({
    description: "변경 대상 로그인 관리자 유저 PK",
    example: 1,
    required: true,
  })
  @IsNumber()
  userId: number;

  @ApiProperty({
    description: "변경할 관리자 이름",
    example: "이트레즐",
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotBlank()
  name: string;
}
