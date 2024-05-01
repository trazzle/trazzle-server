import { IsString } from "class-validator";
import { IsNotBlank } from "src/validator/is-not-blank";
import { ApiProperty } from "@nestjs/swagger";

export class CreateAdminRequestBodyDto {
  @ApiProperty({
    description: "이름",
    example: "김트레즐",
    required: true,
  })
  @IsString()
  @IsNotBlank({ message: "이름[name]은 필수 입력값입니다." })
  name: string;

  @ApiProperty({
    description: "계정",
    example: "trazzle",
    required: true,
  })
  @IsString()
  @IsNotBlank({ message: "계정[account]은 필수 입력값입니다." })
  account: string;
}
