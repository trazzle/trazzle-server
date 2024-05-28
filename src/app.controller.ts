import { Controller, Get, Res } from "@nestjs/common";
import { AppService } from "./app.service";
import { RedisService } from "src/modules/core/redis/redis.service";
import { ApiExcludeController } from "@nestjs/swagger";
import { Response } from "express";

@ApiExcludeController()
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly redisService: RedisService,
  ) {}

  @Get("api-docs")
  async getApiDocs(@Res() res: Response) {
    res.sendFile("index.html", { root: "public" });
  }
}
