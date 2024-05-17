import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { BackOfficeAdminService } from "src/modules/back-office/services/back-office-admin.service";
import { CreateAdminRequestBodyDto } from "../dtos/req/create-admin-request-body.dto";
import { AdminGuard } from "src/guards/admin-auth.guard";
import { SignInUser } from "src/decorators/sign-in-user.decorator";
import { GetAdminsRequestBodyDto } from "src/modules/back-office/dtos/req/get-admins-request-body.dto";
import { UpdateAdminInfoRequestBodyDto } from "../dtos/req/update-admin-info-request-body.dto";
import { LoginSucceedUserResponseDto } from "src/modules/users/dtos/res/login-succeed-user-response.dto";

@Controller("admins")
export class BackOfficeAdminController {
  constructor(private readonly backOfficeAdminService: BackOfficeAdminService) {}

  @Post()
  async createAdmin(@Body() body: CreateAdminRequestBodyDto) {
    return await this.backOfficeAdminService.createAdmin(body);
  }

  @UseGuards(AdminGuard)
  @Get()
  getAdmins(@Query() dto: GetAdminsRequestBodyDto) {
    return this.backOfficeAdminService.getAdmins(dto);
  }

  @UseGuards(AdminGuard)
  @Get(":id")
  async getAdminInfo(@Param("id", ParseIntPipe) id: number) {
    return await this.backOfficeAdminService.getAdminInfo(id);
  }

  @UseGuards(AdminGuard)
  @Patch()
  async updateAdminInfo(
    @Body() body: UpdateAdminInfoRequestBodyDto,
    @SignInUser() adminUser: LoginSucceedUserResponseDto,
  ) {
    return await this.backOfficeAdminService.updateAdminInfo({ userId: adminUser.user_id, ...body });
  }

  @UseGuards(AdminGuard)
  @Delete()
  deleteAdmin(@SignInUser() adminUser: LoginSucceedUserResponseDto) {
    // 탈퇴처리된 유저는 유저데이터로우 삭제
    return this.backOfficeAdminService.deleteAdmin(adminUser.user_id);
  }
}
