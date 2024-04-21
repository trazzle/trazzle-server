import { IsNotEmpty, IsOptional, MaxLength } from "class-validator";
import { Transform } from "class-transformer";
import { LocalDate } from "@js-joda/core";
import { isNumberOrElseThrow, isOptionalOrNumberOrElseThrow, toLocalDate } from "src/util/transform";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTravelNoteDto {
  @ApiProperty({
    description: "여행 시작날짜",
    example: "2024-03-31",
    required: true,
  })
  @IsNotEmpty({ message: "여행 시작일[startDate]은 필수 입력값입니다." })
  @Transform(toLocalDate("여행 시작일의 날짜 형식이 올바르지 않습니다. [YYYY-MM-DD]"))
  startDate: LocalDate;

  @ApiProperty({
    description: "여행 종료날짜",
    example: "2024-04-30",
    required: true,
  })
  @IsNotEmpty({ message: "여행 종료일[endDate]은 필수 입력값입니다." })
  @Transform(toLocalDate("여행 종료일의 날짜 형식이 올바르지 않습니다. [YYYY-MM-DD]"))
  endDate: LocalDate;

  @ApiProperty({
    description: "제목",
    example: "여행기 제목",
    required: true,
  })
  @IsNotEmpty({ message: "제목[title]은 문자열이어야 합니다." })
  @MaxLength(20, {
    message: "제목[title]은 최대 20글자까지 가능합니다.",
  })
  title: string;

  @ApiProperty({
    description: "여행기",
    example: "여행기 내용",
    required: false,
  })
  //@IsNotEmpty({ message: "여행기[review]는 문자열이어야 합니다." })
  @IsOptional()
  @MaxLength(280, {
    message: "여행기[review]는 최대 280글자까지 가능합니다.",
  })
  review: string;

  // @IsNumber({}, { message: '도시ID[cityId]는 숫자여야 합니다.' })
  // @IsOptional()
  @ApiProperty({
    description: "도시 고유 PK",
    example: 1,
    required: true,
  })
  @Transform(isOptionalOrNumberOrElseThrow("도시ID[cityId]는 숫자여야 합니다."))
  cityId: number;

  @ApiProperty({
    description: "도시명(도시ID가 없을 경우에만 입력 -> 기타도시 선택시)",
    example: "Seoul",
    required: false,
  })
  @IsOptional()
  cityName: string;

  @ApiProperty({
    description: "메인 이미지 인덱스 (1 - 6)",
    example: 1,
    required: false,
  })
  @Transform(isNumberOrElseThrow("메인 이미지 인덱스[mainImageIndex]는 숫자여야 합니다."))
  mainImageIndex: number;
}
