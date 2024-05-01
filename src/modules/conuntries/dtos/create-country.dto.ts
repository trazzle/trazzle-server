import { IsOptional } from "class-validator";
import { IsNotBlank } from "src/validator/is-not-blank";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCountryDto {
  @ApiProperty({
    description: "국가 코드",
    example: "KR",
    required: true,
  })
  @IsNotBlank({ message: "국가코드[code]는 필수 입력값입니다." })
  code: string;

  @ApiProperty({
    description: "국가명",
    example: "대한민국",
    required: true,
  })
  @IsNotBlank({ message: "국가명[name]은 필수 입력값입니다." })
  name: string;

  @ApiProperty({
    description: "대륙명",
    example: "Asia",
    required: true,
  })
  @IsOptional()
  continent: string;
}
