import { Controller, Get, UseGuards } from "@nestjs/common";
import { SignInUser } from "src/decorators/sign-in-user.decorator";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { LoginSucceedUserResponseDto } from "src/modules/users/dtos/res/login-succeed-user-response.dto";
import { UserStatisticsService } from "src/modules/users/services/statistics.service";

@Controller("statistics")
export class UserStatisticsController {
  constructor(private readonly statisticsService: UserStatisticsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserTravelStatistics(@SignInUser() user: LoginSucceedUserResponseDto) {
    const { user_id } = user;
    const result = await this.statisticsService.getUserTravelStatistics(user_id);
    return result;
  }
}
