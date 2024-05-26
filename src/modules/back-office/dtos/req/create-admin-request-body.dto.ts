import { IsString } from "class-validator";
import { IsNotBlank } from "src/validator/is-not-blank";

export class CreateAdminRequestBodyDto {
  @IsString()
  @IsNotBlank({ message: "이름[name]은 필수 입력값입니다." })
  name: string;

  @IsString()
  @IsNotBlank({ message: "계정[account]은 필수 입력값입니다." })
  account: string;
}
