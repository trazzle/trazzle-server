import { ApiProperty } from "@nestjs/swagger";

export class GetUserTravelStatisticResponseDto {
  @ApiProperty({
    description: "여행기록 개수",
    example: 4,
  })
  travel: number;

  @ApiProperty({
    description: "여행국가 개수",
    example: 2,
  })
  countries: number;

  @ApiProperty({
    description: "세계여행 백분율(소수점아래 2자리만 표기)",
    example: "0.84",
  })
  world: string;
}
