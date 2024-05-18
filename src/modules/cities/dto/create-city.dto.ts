import { IsNotBlank } from "src/validator/is-not-blank";

export class CreateCityDto {
  @IsNotBlank({ message: "도시 이름[name]은 필수 입력값입니다." })
  name: string;

  @IsNotBlank({ message: "국가코드 [countryCode]는 필수 입력값입니다." })
  countryCode: string;
}
