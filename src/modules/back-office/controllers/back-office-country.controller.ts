import { Controller, Patch, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { BackOfficeCountryService } from "src/modules/back-office/services/back-office-country.service";

@Controller("countries")
@ApiTags("백오피스 API - 국가")
export class BackOfficeCountryController {
  constructor(private readonly backOfficeCountryService: BackOfficeCountryService) {}

  @ApiOperation({ summary: "국가 생성" })
  @Post()
  async createCountry() {
    return "createCountry";
  }

  @ApiOperation({ summary: "국가 정보 수정" })
  @Patch()
  async updateCountryInfo() {
    return "updateCountryInfo";
  }
}
