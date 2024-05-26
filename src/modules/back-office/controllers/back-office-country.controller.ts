import { Body, Controller, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { AdminGuard } from "src/guards/admin-auth.guard";
import { BackOfficeCountryService } from "src/modules/back-office/services/back-office-country.service";
import { CreateCountryDto } from "src/modules/conuntries/dtos/create-country.dto";
import { UpdateCountryDto } from "src/modules/conuntries/dtos/update-country.dto";

@UseGuards(AdminGuard)
@Controller("countries")
export class BackOfficeCountryController {
  constructor(private readonly backOfficeCountryService: BackOfficeCountryService) {}

  @Post()
  createNewCountry(@Body() dto: CreateCountryDto) {
    return this.backOfficeCountryService.create(dto);
  }

  @Patch(":code")
  updateCountryInfo(@Param("code") code: string, @Body() dto: UpdateCountryDto) {
    return this.backOfficeCountryService.update(code, dto);
  }
}
