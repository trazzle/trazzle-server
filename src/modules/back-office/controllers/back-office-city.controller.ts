import { Body, Controller, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { BackOfficeCityService } from "src/modules/back-office/services/back-office-city.service";
import { CreateCityDto } from "src/modules/cities/dto/create-city.dto";
import { UpdateCityDto } from "src/modules/cities/dto/update-city.dto";

@Controller("cities")
@ApiTags("백오피스 API - 도시")
export class BackOfficeCityController {
  constructor(private readonly backOfficeCityService: BackOfficeCityService) {}

  @ApiOperation({ summary: "도시 생성" })
  @Post()
  createCity(@Body() createCityDto: CreateCityDto) {
    return this.backOfficeCityService.create(createCityDto);
  }

  @ApiOperation({ summary: "도시 정보 수정" })
  @Patch()
  updateCityInfo(@Param("id", ParseIntPipe) id: string, @Body() updateCityDto: UpdateCityDto) {
    return this.backOfficeCityService.update(+id, updateCityDto);
  }
}
