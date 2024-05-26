import { Controller, Get, ParseIntPipe, Query, UseGuards } from "@nestjs/common";
import { MagnetsService } from "../service/magnets.service";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller()
export class MagnetsController {
  constructor(private readonly magnetsService: MagnetsService) {}

  @Get()
  findAll(@Query("cityId", ParseIntPipe) cityId: number) {
    return this.magnetsService.list(cityId);
  }
}
