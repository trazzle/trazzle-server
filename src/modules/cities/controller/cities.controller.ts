import { Controller, Get, Query } from "@nestjs/common";
import { CitiesService } from "../service/cities.service";
import { SearchCityDto } from "../dto/search-city.dto";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CityEntity } from "../entities/city.entity";

@ApiTags("City")
@Controller()
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @ApiOperation({ summary: "도시 검색" })
  @ApiOkResponse({ type: CityEntity, isArray: true })
  @Get()
  findAll(@Query() query: SearchCityDto) {
    return this.citiesService.findAll(query);
  }
}
