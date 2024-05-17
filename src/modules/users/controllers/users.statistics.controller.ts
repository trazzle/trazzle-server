import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { BearerAuth } from "src/decorators/bearer-auth.decorator";
import { SignInUser } from "src/decorators/sign-in-user.decorator";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { GetUserTravelStatisticResponseDto } from "src/modules/users/dtos/res/get-user-travel-statistics-response.dto";
import { LoginSucceedUserResponseDto } from "src/modules/users/dtos/res/login-succeed-user-response.dto";
import { UserStatisticsService } from "src/modules/users/services/statistics.service";

@ApiTags("사용자 여행 통계")
@Controller("statistics")
export class UserStatisticsController {
  constructor(private readonly statisticsService: UserStatisticsService) {}

  @ApiOperation({ summary: "여행 국가 통계 조회" })
  @BearerAuth(JwtAuthGuard)
  @ApiOkResponse({
    description: "여행 국가 통계 정상 응답데이터",
    type: GetUserTravelStatisticResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserTravelStatistics(@SignInUser() user: LoginSucceedUserResponseDto) {
    const { id } = user;
    const result = await this.statisticsService.getUserTravelStatistics(id);
    return result;
  }
}
