import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { MagnetsService } from "../service/magnets.service";
import { CreateMagnetDto } from "src/modules/magnets/dtos/create-magnet.dto";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { MagnetEntity } from "src/modules/magnets/entities/magnet.entity";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { SignInUser } from "src/decorators/sign-in-user.decorator";
import { UserEntity } from "src/modules/users/entities/user.entity";

@ApiBearerAuth()
@ApiTags("마그넷")
@UseGuards(JwtAuthGuard)
@Controller()
export class MagnetsController {
  constructor(private readonly magnetsService: MagnetsService) {}

  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "마그넷 생성" })
  @ApiOkResponse({ description: "마그넷", type: MagnetEntity })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        image: {
          type: "file",
          format: "binary",
          description: "마그넷 이미지",
        },
        cityId: { type: "number", example: "1", description: "도시 ID" },
      },
      required: ["image", "cityId"],
    },
  })
  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: "image", maxCount: 1 }]))
  create(
    @SignInUser() user: UserEntity,
    @Body() body: CreateMagnetDto,
    @UploadedFiles() { image }: { image: Express.Multer.File[] },
  ) {
    if (!image) {
      throw new BadRequestException("이미지가 필요합니다.");
    }

    return this.magnetsService.create(user.id, body, image[0]);
  }

  @ApiConsumes("application/json")
  @ApiOperation({ summary: "마그넷 조회" })
  @ApiQuery({
    name: "cityId",
    required: true,
    type: Number,
    description: "도시 고유 PK",
    example: 1,
  })
  @Get()
  findAll(@Query("cityId", ParseIntPipe) cityId: number) {
    return this.magnetsService.list(cityId);
  }

  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "마그넷 수정" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        image: {
          type: "file",
          format: "binary",
          description: "마그넷 이미지",
        },
      },
      required: ["image"],
    },
  })
  @Put(":id")
  @UseInterceptors(FileFieldsInterceptor([{ name: "image", maxCount: 1 }]))
  update(@Param("id", ParseIntPipe) id: number, @UploadedFiles() { image }: { image: Express.Multer.File[] }) {
    if (!image) {
      throw new BadRequestException("이미지가 필요합니다.");
    }

    return this.magnetsService.update(id, image[0]);
  }

  @ApiConsumes("application/json")
  @ApiOperation({ summary: "마그넷 삭제" })
  @ApiParam({
    name: "id",
    required: true,
    type: "number",
    description: "마그넷 고유번호 PK",
    example: 1,
  })
  @Delete(":id")
  delete(@Param("id", ParseIntPipe) id: number) {
    return this.magnetsService.delete(id);
  }
}
