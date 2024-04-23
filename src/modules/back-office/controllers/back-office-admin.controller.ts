import { Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { BackOfficeAdminService } from "src/modules/back-office/services/back-office-admin.service";

@Controller("admins")
@ApiTags("백오피스 API - 관리자")
export class BackOfficeAdminController {
  constructor(private readonly backOfficeAdminService: BackOfficeAdminService) {}

  @ApiOperation({ summary: "신규 관리자 회원 생성" })
  @Post()
  async createAdmin() {
    return "createAdmin";
  }

  @ApiOperation({ summary: "신규 관리자 회원 목록 조회" })
  @Get()
  async getAdmins() {
    return "getAdmins";
  }

  @ApiOperation({ summary: "신규 관리자 회원 단건 조회" })
  @Get(":id")
  async getAdminInfo(@Param("id", ParseIntPipe) id: number) {
    return "getAdminInfo" + id;
  }

  @ApiOperation({ summary: "관리자 회원 정보 수정" })
  @Patch()
  async updateAdminInfo() {
    return "updateAdminInfo";
  }

  @ApiOperation({ summary: "관리자 회원 탈퇴" })
  @Delete()
  async deleteAdmin() {
    return "deleteAdmin";
  }
}
