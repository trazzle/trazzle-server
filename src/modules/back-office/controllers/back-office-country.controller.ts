import { Body, Controller, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AdminBearerAuth } from "src/decorators/admin-auth.decorator";
import { AdminGuard } from "src/guards/admin-auth.guard";
import { BackOfficeCountryService } from "src/modules/back-office/services/back-office-country.service";
import { CreateCountryDto } from "src/modules/conuntries/dtos/create-country.dto";

import { UpdateCountryDto } from "src/modules/conuntries/dtos/update-country.dto";
import { CountryEntity } from "src/modules/conuntries/entities/country.entity";

@AdminBearerAuth(AdminGuard)
@UseGuards(AdminGuard)
@Controller("countries")
@ApiTags("백오피스 API - 국가")
export class BackOfficeCountryController {
  constructor(private readonly backOfficeCountryService: BackOfficeCountryService) {}

  @ApiOperation({ summary: "국가 생성" })
  @ApiOkResponse({ description: "신규 국가", type: CountryEntity })
  @Post()
  createNewCountry(@Body() dto: CreateCountryDto) {
    return this.backOfficeCountryService.create(dto);
  }

  @ApiOperation({ summary: "국가 정보 수정" })
  @ApiOkResponse({ description: "수정된 국가 정보", type: CountryEntity })
  @Patch(":code")
  updateCountryInfo(@Param("code") code: string, @Body() dto: UpdateCountryDto) {
    return this.backOfficeCountryService.update(code, dto);
  }
}
