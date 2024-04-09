import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { isOptionalOrNumberOrElseThrow } from "src/util/transform";

export class CreateMagnetDto {

  @ApiProperty({
    description: "도시 고유 PK",
    example: 1,
    required: true,
  })
  @Transform(isOptionalOrNumberOrElseThrow("도시ID[cityId]는 숫자여야 합니다."))
  cityId: number;

}
