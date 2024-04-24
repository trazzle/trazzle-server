import { Controller, Patch, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { BackOfficeCityService } from "src/modules/back-office/services/back-office-city.service";

@Controller("cities")
@ApiTags("백오피스 API - 도시")
export class BackOfficeCityController {
  constructor(private readonly backOfficeCityService: BackOfficeCityService) {}

  @ApiOperation({ summary: "도시 생성" })
  @Post()
  createCity() {
    return "createCity";
  }

  @ApiOperation({ summary: "도시 정보 수정" })
  @Patch()
  updateCityInfo() {
    return "updateCityInfo";
  }
}
