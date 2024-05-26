import { IsOptional } from "class-validator";
import { IsNotBlank } from "src/validator/is-not-blank";

export class CreateCountryDto {
  @IsNotBlank({ message: "국가코드[code]는 필수 입력값입니다." })
  code: string;

  @IsNotBlank({ message: "국가명[name]은 필수 입력값입니다." })
  name: string;

  @IsOptional()
  continent: string;
}
