import { Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { BackOfficeCityService } from "src/modules/back-office/services/back-office-city.service";

@Controller("cities")
@ApiTags("백오피스 API - 도시")
export class BackOfficeCityController {
  constructor(private readonly backOfficeCityService: BackOfficeCityService) {}

  @ApiOperation({ summary: "신규 관리자 회원 생성" })
  @Post("admin")
  async createAdminUser() {}

  @ApiOperation({ summary: "국가 생성" })
  @Post("country")
  async createCountry() {}
}
