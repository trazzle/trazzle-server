import { Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { BackOfficeAdminService } from "src/modules/back-office/services/back-office-admin.service";

@Controller("admins")
@ApiTags("백오피스 API - 관리자")
export class BackOfficeAdminController {
  constructor(private readonly backOfficeAdminService: BackOfficeAdminService) {}

  @ApiOperation({ summary: "신규 관리자 회원 생성" })
  @Post()
  async createAdminUser() {}
}
