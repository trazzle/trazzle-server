import { ApiProperty } from "@nestjs/swagger";
import { Country } from "@prisma/client";

export class CountryEntity implements Country {
  @ApiProperty({
    description: "국가 PK",
    example: 1,
    uniqueItems: true,
  })
  id: number;

  @ApiProperty({
    description: "국가코드",
    example: "KR",
    uniqueItems: true,
  })
  code: string;

  @ApiProperty({
    description: "국가명",
    example: "South Korea",
    uniqueItems: true,
  })
  name: string;

  @ApiProperty({
    description: "대륙명 검색옵션",
    example: "Asia",
  })
  continent: string;

  createdAt: Date;
  updatedAt: Date;
}
