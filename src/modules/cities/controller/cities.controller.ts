import { Controller, Get, Query } from "@nestjs/common";
import { CitiesService } from "../service/cities.service";
import { SearchCityDto } from "../dto/search-city.dto";

@Controller()
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Get()
  findAll(@Query() query: SearchCityDto) {
    return this.citiesService.findAll(query);
  }
}
