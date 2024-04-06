import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class SearchCountryDto {
  @ApiProperty({
    required: false,
    description: "국가이름",
    example: "South Korea",
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    required: false,
    description: "국가코드",
    example: "KR",
  })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({
    required: false,
    description: "대륙이름",
    example: "Asia",
  })
  @IsOptional()
  @IsString()
  continent?: string;

  @ApiProperty({
    required: false,
    description: "페이지 커서(국가 넘버 PK)",
    example: 116,
  })
  @IsOptional()
  @Transform(({ value }) => {
    return Number(value);
  })
  @IsNumber()
  cursor?: number;
}
