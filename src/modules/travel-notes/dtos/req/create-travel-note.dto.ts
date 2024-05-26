import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
import { Transform } from "class-transformer";
import { LocalDate } from "@js-joda/core";
import { isNumberOrElseThrow, isOptionalOrNumberOrElseThrow, toLocalDate } from "src/util/transform";
import { IsNotBlank } from "src/validator/is-not-blank";

export class CreateTravelNoteDto {
  @IsNotEmpty({ message: "여행 시작일[startDate]은 필수 입력값입니다." })
  @Transform(toLocalDate("여행 시작일의 날짜 형식이 올바르지 않습니다. [YYYY-MM-DD]"))
  startDate: LocalDate;

  @IsNotEmpty({ message: "여행 종료일[endDate]은 필수 입력값입니다." })
  @Transform(toLocalDate("여행 종료일의 날짜 형식이 올바르지 않습니다. [YYYY-MM-DD]"))
  endDate: LocalDate;

  @IsNotBlank({ message: "제목[title]은 필수 입력값입니다." })
  @MaxLength(20, {
    message: "제목[title]은 최대 20글자까지 가능합니다.",
  })
  title: string;

  @IsOptional()
  @MaxLength(280, {
    message: "여행기[review]는 최대 280글자까지 가능합니다.",
  })
  review: string;

  @IsOptional()
  @IsNumber({}, { message: "도시ID[cityId]는 숫자여야 합니다." })
  @Transform(isOptionalOrNumberOrElseThrow("도시ID[cityId]는 숫자여야 합니다."))
  cityId: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  cityName: string;

  @IsOptional()
  @IsString()
  countryCode: string;

  @Transform(isNumberOrElseThrow("메인 이미지 인덱스[mainImageIndex]는 숫자여야 합니다."))
  mainImageIndex: number;
}
