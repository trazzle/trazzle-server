import { Body, Controller, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { AdminGuard } from "src/guards/admin-auth.guard";
import { BackOfficeCityService } from "src/modules/back-office/services/back-office-city.service";
import { CreateCityDto } from "src/modules/cities/dto/create-city.dto";
import { UpdateCityDto } from "src/modules/cities/dto/update-city.dto";

@UseGuards(AdminGuard)
@Controller("cities")
export class BackOfficeCityController {
  constructor(private readonly backOfficeCityService: BackOfficeCityService) {}

  @Post()
  createCity(@Body() createCityDto: CreateCityDto) {
    return this.backOfficeCityService.create(createCityDto);
  }

  @Patch()
  updateCityInfo(@Param("id", ParseIntPipe) id: string, @Body() updateCityDto: UpdateCityDto) {
    return this.backOfficeCityService.update(+id, updateCityDto);
  }
}
