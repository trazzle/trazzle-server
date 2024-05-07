import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { isNumberOrElseThrow, isOptionalOrNumberOrElseThrow } from "src/util/transform";

export class CreateMagnetDto {
  @ApiProperty({
    description: "도시ID",
    example: 1,
    required: true,
  })
  @Transform(isNumberOrElseThrow("도시ID[cityId]는 필수이며 숫자 형식이어야 합니다."))
  cityId: number;

  @ApiProperty({
    description: "마그넷 가격(퍼즐) / 0 또는 미입력 시 무료",
    example: 100,
    required: false,
  })
  @Transform(isOptionalOrNumberOrElseThrow("마그넷 가격[cost]는 숫자여야 합니다."))
  cost?: number;
}
