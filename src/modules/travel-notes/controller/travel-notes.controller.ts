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
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { CreateTravelNoteDto } from "src/modules/travel-notes/dtos/req/create-travel-note.dto";
import { TravelNotesService } from "src/modules/travel-notes/service/travel-notes.service";
import { UpdateTravelNoteDto } from "src/modules/travel-notes/dtos/req/update-travel-note.dto";
import { SignInUser } from "src/decorators/sign-in-user.decorator";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { isImageFile } from "src/util/file";
import { LoginSucceedUserResponseDto } from "src/modules/users/dtos/res/login-succeed-user-response.dto";

@UseGuards(JwtAuthGuard)
@Controller()
export class TravelNotesController {
  constructor(private readonly travelNotesService: TravelNotesService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: "image1", maxCount: 1 },
      { name: "image2", maxCount: 1 },
      { name: "image3", maxCount: 1 },
      { name: "image4", maxCount: 1 },
      { name: "image5", maxCount: 1 },
      { name: "image6", maxCount: 1 },
    ]),
  )
  async create(
    @SignInUser() user: LoginSucceedUserResponseDto,
    @Body() body: CreateTravelNoteDto,
    @UploadedFiles()
    files: {
      image1?: Express.Multer.File[];
      image2?: Express.Multer.File[];
      image3?: Express.Multer.File[];
      image4?: Express.Multer.File[];
      image5?: Express.Multer.File[];
      image6?: Express.Multer.File[];
    },
  ) {
    const images = [
      { sequence: 1, file: files?.image1 ? files.image1[0] : null },
      { sequence: 2, file: files?.image2 ? files.image2[0] : null },
      { sequence: 3, file: files?.image3 ? files.image3[0] : null },
      { sequence: 4, file: files?.image4 ? files.image4[0] : null },
      { sequence: 5, file: files?.image5 ? files.image5[0] : null },
      { sequence: 6, file: files?.image6 ? files.image6[0] : null },
    ].filter(image => image.file); // 파일 존재

    if (images.some(file => !isImageFile(file.file))) {
      throw new BadRequestException("이미지 파일만 업로드 가능합니다.");
    }

    return await this.travelNotesService.create(user.user_id, body, images);
  }

  @Get()
  async list(@Req() request: Request, @Query("userId", ParseIntPipe) userId: string) {
    const newVar = await this.travelNotesService.list(Number(userId));
    return newVar;
  }

  @Get(":id")
  async getOneTravelNote(@Param("id", ParseIntPipe) id: number) {
    return this.travelNotesService.getOne(id);
  }

  @Put(":id")
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: "image1", maxCount: 1 },
      { name: "image2", maxCount: 1 },
      { name: "image3", maxCount: 1 },
      { name: "image4", maxCount: 1 },
      { name: "image5", maxCount: 1 },
      { name: "image6", maxCount: 1 },
    ]),
  )
  async update(
    @SignInUser() user: LoginSucceedUserResponseDto,
    @Param("id", ParseIntPipe) id: number,
    @Body() body: UpdateTravelNoteDto,
    @UploadedFiles()
    files: {
      image1?: Express.Multer.File[];
      image2?: Express.Multer.File[];
      image3?: Express.Multer.File[];
      image4?: Express.Multer.File[];
      image5?: Express.Multer.File[];
      image6?: Express.Multer.File[];
    },
  ) {
    const images = [
      { sequence: 1, file: files?.image1 ? files.image1[0] : null },
      { sequence: 2, file: files?.image2 ? files.image2[0] : null },
      { sequence: 3, file: files?.image3 ? files.image3[0] : null },
      { sequence: 4, file: files?.image4 ? files.image4[0] : null },
      { sequence: 5, file: files?.image5 ? files.image5[0] : null },
      { sequence: 6, file: files?.image6 ? files.image6[0] : null },
    ].filter(image => image.file); // 파일 존재

    if (images.some(file => !isImageFile(file.file))) {
      throw new BadRequestException("이미지 파일만 업로드 가능합니다.");
    }

    return this.travelNotesService.update(user.user_id, id, body, images);
  }

  @Delete(":id")
  async delete(@SignInUser() user: LoginSucceedUserResponseDto, @Param("id", ParseIntPipe) id: number) {
    return this.travelNotesService.delete(user.user_id, id);
  }
}
