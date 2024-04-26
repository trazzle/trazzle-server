import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { BackOfficeAdminService } from "src/modules/back-office/services/back-office-admin.service";
import { CreateAdminRequestBodyDto } from "../dtos/req/create-admin-request-body.dto";
import { AdminGuard } from "src/guards/admin-auth.guard";
import { AdminBearerAuth } from "src/decorators/admin-auth.decorator";

@Controller("admins")
@ApiTags("백오피스 API - 관리자")
export class BackOfficeAdminController {
  constructor(private readonly backOfficeAdminService: BackOfficeAdminService) {}

  @ApiOperation({ summary: "신규 관리자 회원 생성" })
  @Post()
  createAdmin(@Body() body: CreateAdminRequestBodyDto) {
    return this.backOfficeAdminService.createAdmin(body);
  }

  @AdminBearerAuth(AdminGuard)
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: "신규 관리자 회원 목록 조회" })
  @Get()
  getAdmins() {
    return "getAdmins";
  }

  @AdminBearerAuth(AdminGuard)
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: "신규 관리자 회원 단건 조회" })
  @Get(":id")
  getAdminInfo(@Param("id", ParseIntPipe) id: number) {
    return "getAdminInfo" + id;
  }

  @AdminBearerAuth(AdminGuard)
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: "관리자 회원 정보 수정" })
  @Patch()
  updateAdminInfo() {
    return "updateAdminInfo";
  }

  @AdminBearerAuth(AdminGuard)
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: "관리자 회원 탈퇴" })
  @Delete()
  deleteAdmin() {
    return "deleteAdmin";
  }
}
