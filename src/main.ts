import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { CustomConfigService } from "./modules/core/config/custom-config.service";
import ENV_KEY from "./modules/core/config/constants/env-config.constant";
import { PrismaService } from "./modules/core/database/prisma/prisma.service";
import CORS_OPTIONS from "src/modules/core/config/constants/cors-option.constant";
import helmet from "helmet";
import { ValidationPipe } from "@nestjs/common";
import { AllExceptionFilter } from "src/filters/all-exception.filter";
import { HttpExceptionFilter } from "src/filters/http-exception.filter";
import "@js-joda/timezone";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import express from "express";
import { ExpressAdapter } from "@nestjs/platform-express";
import { SwaggerModule } from "@nestjs/swagger";
import { load } from "js-yaml";
import appRootPath from "app-root-path";
import { join } from "path";
import { readFileSync } from "fs";

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  app.useGlobalFilters(new AllExceptionFilter(), new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 들어오는 요청의 payload를 DTO의 타입으로 변환
    }),
  );

  const customConfigService = app.get<CustomConfigService>(CustomConfigService);

  // Prisma
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  // helmet
  app.use(helmet());

  // CORS
  app.enableCors(CORS_OPTIONS);

  const openapiPath = join(appRootPath.path, "openapi", "openapi.yaml");
  console.log("path: ", openapiPath);

  const openapiDocument = load(readFileSync(openapiPath));

  //const swaggerDocument = SwaggerModule.createDocument(app, openapiDocument);
  console.log(openapiDocument);
  SwaggerModule.setup("api-docs", app, openapiDocument);

  // Run server
  const SERVER_PORT = customConfigService.get<number>(ENV_KEY.SERVER_PORT) || 3000;
  await app.listen(SERVER_PORT);
}
bootstrap();
