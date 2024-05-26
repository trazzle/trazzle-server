import { Transform } from "class-transformer";
import { isOptionalOrNumberOrElseThrow } from "src/util/transform";

export class CreateMagnetDto {
  @Transform(isOptionalOrNumberOrElseThrow("도시ID[cityId]는 숫자여야 합니다."))
  cityId: number;
}
