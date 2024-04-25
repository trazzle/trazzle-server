import { Controller, Get, ParseIntPipe, Query, UseGuards } from "@nestjs/common";
import { MagnetsService } from "../service/magnets.service";
import { ApiConsumes, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { BearerAuth } from "src/decorators/bearer-auth.decorator";

@BearerAuth(JwtAuthGuard)
@ApiTags("마그넷")
@UseGuards(JwtAuthGuard)
@Controller()
export class MagnetsController {
  constructor(private readonly magnetsService: MagnetsService) {}

  @ApiConsumes("application/json")
  @ApiOperation({ summary: "마그넷 조회" })
  @ApiQuery({
    name: "cityId",
    required: true,
    type: Number,
    description: "도시 고유 PK",
    example: 1,
  })
  @Get()
  findAll(@Query("cityId", ParseIntPipe) cityId: number) {
    return this.magnetsService.list(cityId);
  }
}
