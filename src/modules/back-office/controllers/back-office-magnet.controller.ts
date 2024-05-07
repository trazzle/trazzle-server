import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AdminBearerAuth } from "src/decorators/admin-auth.decorator";
import { AdminGuard } from "src/guards/admin-auth.guard";
import { BackOfficeMagnetService } from "src/modules/back-office/services/back-office-magnet.service";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { CreateMagnetDto } from "src/modules/back-office/dtos/req/create-magnet.dto";

@AdminBearerAuth(AdminGuard)
@UseGuards(AdminGuard)
@Controller("magnets")
@ApiTags("백오피스 API - 마그넷")
export class BackOfficeMagnetController {
  constructor(private readonly backOfficeMagnetService: BackOfficeMagnetService) {}

  @ApiOperation({ summary: "마그넷 생성" })
  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: "image", maxCount: 1 }]))
  createMagnet(
    @Body() body: CreateMagnetDto,
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
    },
  ) {
    if (!files.image) {
      throw new BadRequestException("이미지 파일이 필요합니다.");
    }
    if (body.cost && body.cost < 0) {
      throw new BadRequestException("가격은 0보다 작을 수 없습니다.");
    }

    return this.backOfficeMagnetService.create(body, files.image[0]);
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
