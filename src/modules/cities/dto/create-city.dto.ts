import { ApiProperty } from "@nestjs/swagger";
import { IsNotBlank } from "src/validator/is-not-blank";

export class CreateCityDto {
  @ApiProperty({
    description: "도시 이름",
    example: "서울",
    required: true,
  })
  @IsNotBlank({ message: "도시 이름[name]은 필수 입력값입니다." })
  name: string;

  @ApiProperty({
    description: "국가 코드",
    example: "KR",
    required: true,
  })
  @IsNotBlank({ message: "국가코드 [countryCode]는 필수 입력값입니다." })
  countryCode: string;
}
