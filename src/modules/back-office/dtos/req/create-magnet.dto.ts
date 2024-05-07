import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class CreateCountryDto {
  @ApiProperty({
    description: "도시ID",
    example: 1,
    required: true,
  })
  @IsNumber({}, { message: "도시ID[cityId]는 숫자여야 합니다." })
  cityId: number;
}
