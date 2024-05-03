import { Body, Controller, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AdminBearerAuth } from "src/decorators/admin-auth.decorator";
import { AdminGuard } from "src/guards/admin-auth.guard";
import { BackOfficeCityService } from "src/modules/back-office/services/back-office-city.service";
import { CreateCityDto } from "src/modules/cities/dto/create-city.dto";
import { UpdateCityDto } from "src/modules/cities/dto/update-city.dto";
import { CityEntity } from "src/modules/cities/entities/city.entity";

@AdminBearerAuth(AdminGuard)
@UseGuards(AdminGuard)
@Controller("cities")
@ApiTags("백오피스 API - 도시")
export class BackOfficeCityController {
  constructor(private readonly backOfficeCityService: BackOfficeCityService) {}

  @ApiOperation({ summary: "도시 생성" })
  @ApiOkResponse({ description: "신규 도시", type: CityEntity })
  @Post()
  createCity(@Body() createCityDto: CreateCityDto) {
    return this.backOfficeCityService.create(createCityDto);
  }

  @ApiOperation({ summary: "도시 정보 수정" })
  @ApiOkResponse({ description: "수정된 도시정보", type: CityEntity })
  @Patch()
  updateCityInfo(@Param("id", ParseIntPipe) id: string, @Body() updateCityDto: UpdateCityDto) {
    return this.backOfficeCityService.update(+id, updateCityDto);
  }
}
