import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { BackOfficeAdminService } from "src/modules/back-office/services/back-office-admin.service";
import { CreateAdminRequestBodyDto } from "../dtos/req/create-admin-request-body.dto";
import { AdminGuard } from "src/guards/admin-auth.guard";
import { SignInUser } from "src/decorators/sign-in-user.decorator";
import { GetAdminsRequestBodyDto } from "src/modules/back-office/dtos/req/get-admins-request-body.dto";
import { UpdateAdminInfoRequestBodyDto } from "../dtos/req/update-admin-info-request-body.dto";
import { LoginSucceedUserResponseDto } from "src/modules/users/dtos/res/login-succeed-user-response.dto";
import { CreateAdminResponseDto } from "src/modules/back-office/dtos/res/create-admin-response.dto";
import { GetAdminsResponseDto } from "src/modules/back-office/dtos/res/get-admins-response.dto";
import { GetAdminInfoResponseDto } from "src/modules/back-office/dtos/res/get-admin-info-response.dto";
import { UpdateAdminInfoResponseDto } from "src/modules/back-office/dtos/res/update-admin-info-response.dto";

@Controller("admins")
export class BackOfficeAdminController {
  constructor(private readonly backOfficeAdminService: BackOfficeAdminService) {}

  @Post()
  async createAdmin(@Body() body: CreateAdminRequestBodyDto): Promise<CreateAdminResponseDto> {
    const newAdmin = await this.backOfficeAdminService.createAdmin(body);
    return {
      admin_user_id: newAdmin.id,
      name: newAdmin.name,
    };
  }

  @UseGuards(AdminGuard)
  @Get()
  async getAdmins(@Query() dto: GetAdminsRequestBodyDto): Promise<GetAdminsResponseDto> {
    const admins = await this.backOfficeAdminService.getAdmins(dto);
    const result: GetAdminInfoResponseDto[] = admins.map(admin => {
      return { admin_user_id: admin.id, name: admin.name };
    });
    return { admins: result };
  }

  @UseGuards(AdminGuard)
  @Get(":id")
  async getAdminInfo(@Param("id", ParseIntPipe) id: number): Promise<GetAdminInfoResponseDto> {
    const adminInfo = await this.backOfficeAdminService.getAdminInfo(id);
    return {
      admin_user_id: adminInfo.id,
      name: adminInfo.name,
    };
  }

  @UseGuards(AdminGuard)
  @Patch()
  async updateAdminInfo(
    @Body() body: UpdateAdminInfoRequestBodyDto,
    @SignInUser() adminUser: LoginSucceedUserResponseDto,
  ): Promise<UpdateAdminInfoResponseDto> {
    const updateAdminInfo = await this.backOfficeAdminService.updateAdminInfo({ userId: adminUser.user_id, ...body });
    return {
      admin_user_id: updateAdminInfo.id,
      name: updateAdminInfo.name,
    };
  }

  @UseGuards(AdminGuard)
  @Delete()
  deleteAdmin(@SignInUser() adminUser: LoginSucceedUserResponseDto) {
    // 탈퇴처리된 유저는 유저데이터로우 삭제
    return this.backOfficeAdminService.deleteAdmin(adminUser.user_id);
  }
}
