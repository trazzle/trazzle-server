import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export class GetAdminsRequestBodyDto {
  @ApiProperty({
    required: false,
    example: "김트레즐",
  })
  @IsOptional()
  name?: string;

  @ApiProperty({
    required: false,
    description: "페이지 커서",
    example: 21,
  })
  @IsOptional()
  @Transform(({ value }) => {
    return Number(value);
  })
  @IsNumber()
  cursor?: number;
}
