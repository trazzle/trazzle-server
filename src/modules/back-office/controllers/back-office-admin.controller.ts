import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { BackOfficeAdminService } from "src/modules/back-office/services/back-office-admin.service";
import { CreateAdminRequestBodyDto } from "../dtos/req/create-admin-request-body.dto";
import { AdminGuard } from "src/guards/admin-auth.guard";
import { AdminBearerAuth } from "src/decorators/admin-auth.decorator";
import { UserEntity } from "src/modules/users/entities/user.entity";
import { SignInUser } from "src/decorators/sign-in-user.decorator";
import { GetAdminsRequestBodyDto } from "src/modules/back-office/dtos/req/get-admins-request-body.dto";
import { UpdateAdminInfoRequestBodyDto } from "../dtos/req/update-admin-info-request-body.dto";

@Controller("admins")
@ApiTags("백오피스 API - 관리자")
export class BackOfficeAdminController {
  constructor(private readonly backOfficeAdminService: BackOfficeAdminService) {}

  @ApiOperation({ summary: "신규 관리자 회원 생성" })
  @ApiOkResponse({ description: "신규 관리자 회원정보", type: UserEntity })
  @Post()
  async createAdmin(@Body() body: CreateAdminRequestBodyDto) {
    return await this.backOfficeAdminService.createAdmin(body);
  }

  @AdminBearerAuth(AdminGuard)
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: "신규 관리자 회원 목록 조회" })
  @Get()
  getAdmins(@Query() dto: GetAdminsRequestBodyDto) {
    return this.backOfficeAdminService.getAdmins(dto);
  }

  @AdminBearerAuth(AdminGuard)
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: "신규 관리자 회원 단건 조회" })
  @Get(":id")
  getAdminInfo(@Param("id", ParseIntPipe) id: number) {
    return this.backOfficeAdminService.getAdminInfo(id);
  }

  @AdminBearerAuth(AdminGuard)
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: "관리자 회원 정보 수정" })
  @Patch()
  async updateAdminInfo(@Body() body: UpdateAdminInfoRequestBodyDto, @SignInUser() adminUser: UserEntity) {
    return await this.backOfficeAdminService.updateAdminInfo({ userId: adminUser.id, ...body });
  }

  @AdminBearerAuth(AdminGuard)
  @UseGuards(AdminGuard)
  @ApiNoContentResponse({ description: "관리자 탈퇴 성공" })
  @ApiOperation({ summary: "관리자 회원 탈퇴" })
  @Delete()
  deleteAdmin(@SignInUser() adminUser: UserEntity) {
    // 탈퇴처리된 유저는 유저데이터로우 삭제
    return this.backOfficeAdminService.deleteAdmin(adminUser.id);
  }
}
