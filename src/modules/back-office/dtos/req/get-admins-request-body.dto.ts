import { Transform } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export class GetAdminsRequestBodyDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  @Transform(({ value }) => {
    return Number(value);
  })
  @IsNumber()
  cursor?: number;
}
