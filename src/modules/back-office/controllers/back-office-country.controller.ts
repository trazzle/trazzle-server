import { Body, Controller, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AdminBearerAuth } from "src/decorators/admin-auth.decorator";
import { AdminGuard } from "src/guards/admin-auth.guard";
import { BackOfficeCountryService } from "src/modules/back-office/services/back-office-country.service";
import { CreateCountryDto } from "src/modules/conuntries/dtos/create-country.dto";

import { UpdateCountryDto } from "src/modules/conuntries/dtos/update-country.dto";

@AdminBearerAuth(AdminGuard)
@UseGuards(AdminGuard)
@Controller("countries")
@ApiTags("백오피스 API - 국가")
export class BackOfficeCountryController {
  constructor(private readonly backOfficeCountryService: BackOfficeCountryService) {}

  @ApiOperation({ summary: "국가 생성" })
  @Post()
  createNewCountry(@Body() dto: CreateCountryDto) {
    return this.backOfficeCountryService.create(dto);
  }

  @ApiOperation({ summary: "국가 정보 수정" })
  @Patch(":code")
  updateCountryInfo(@Param("code") code: string, @Body() dto: UpdateCountryDto) {
    return this.backOfficeCountryService.update(code, dto);
  }
}
