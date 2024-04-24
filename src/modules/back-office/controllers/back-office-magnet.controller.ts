import { Controller, Delete, Patch, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { BackOfficeMagnetService } from "src/modules/back-office/services/back-office-magnet.service";

@Controller("magnets")
@ApiTags("백오피스 API - 마그넷")
export class BackOfficeMagnetController {
  constructor(private readonly backOfficeMagnetService: BackOfficeMagnetService) {}

  @ApiOperation({ summary: "마그넷 생성" })
  @Post()
  createMagnet() {
    return "createMagnet";
  }

  @ApiOperation({ summary: "마그넷 정보 수정" })
  @Patch()
  updateMagnet() {
    return "updateMagnet";
  }

  @ApiOperation({ summary: "마그넷 삭제" })
  @Delete()
  deleteMagnet() {
    return "deleteMagnet";
  }
}
