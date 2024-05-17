import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { CountriesService } from "../service/countries.service";
import { SearchCountryDto } from "../dtos/search-country.dto";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller()
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  findAll(@Query() dto: SearchCountryDto) {
    return this.countriesService.findAll(dto);
  }
}
