import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { CountriesService } from "../service/countries.service";
import { SearchCountryDto } from "../dtos/search-country.dto";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CountryEntity } from "../entities/country.entity";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";

@ApiTags("Country")
@UseGuards(JwtAuthGuard)
@Controller()
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @ApiOperation({ summary: "국가 검색" })
  @ApiOkResponse({ type: CountryEntity, isArray: true })
  @Get()
  findAll(@Query() dto: SearchCountryDto) {
    return this.countriesService.findAll(dto);
  }
}
