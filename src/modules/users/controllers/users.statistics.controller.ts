import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { BearerAuth } from "src/decorators/bearer-auth.decorator";
import { SignInUser } from "src/decorators/sign-in-user.decorator";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { TravelNotesService } from "src/modules/travel-notes/service/travel-notes.service";
import { UserEntity } from "src/modules/users/entities/user.entity";

@ApiTags("사용자 여행 통계")
@Controller("statistics")
export class UserStatisticsController {
  constructor(private readonly travelNoteService: TravelNotesService) {}

  @ApiOperation({ summary: "로그인한 회원이 작성한 여행기록 개수" })
  @BearerAuth(JwtAuthGuard)
  @ApiOkResponse({
    description: "여행기록 개수",
    //   type:
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserTravelStatistics(@SignInUser() user: UserEntity) {
    const { id } = user;
    await this.travelNoteService.getUserTravelStatistics(id);
  }
}
