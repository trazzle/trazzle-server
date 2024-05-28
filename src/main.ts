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
import * as OpenApiValidator from "express-openapi-validator";
import express from "express";
import { ExpressAdapter } from "@nestjs/platform-express";

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
  server.use(
    OpenApiValidator.middleware({
      apiSpec: "./openapi.yaml",
      validateRequests: true,
      validateResponses: true,
    }),
  );
  // app.use(
  //   OpenApiValidator.middleware({
  //     apiSpec: "./openapi.yaml",
  //     validateRequests: true, // (default)
  //     validateResponses: true, // false by default
  //   }),
  // );

  const customConfigService = app.get<CustomConfigService>(CustomConfigService);

  // Prisma
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  // helmet
  app.use(helmet());

  // CORS
  app.enableCors(CORS_OPTIONS);

  // // swagger
  // const swaggerConfig = new DocumentBuilder()
  //   .setTitle("api-docs")
  //   .setDescription("API Description")
  //   .setVersion("1.0")
  //   .addBearerAuth()
  //   .build();
  // const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  // SwaggerModule.setup("api-docs", app, swaggerDocument);

  // Load and merge YAML file
  // const openapiPath = path.join(__dirname, "../../openapi");
  // const openapiDocument = YAML.load(path.join("openapi.yaml"));
  // console.log(openapiDocument);
  //
  // const newVar = await SwaggerParser.validate(openapiDocument);
  // console.log(newVar);
  //
  // // Swagger configuration
  // const options = new DocumentBuilder().setTitle("My API").setDescription("API description").setVersion("1.0").build();
  // const document = SwaggerModule.createDocument(app, options, {
  //   extraModels: [],
  // });
  //
  // // Merge the loaded YAML document with the Swagger document
  // Object.assign(document, openapiDocument);
  //
  // SwaggerModule.setup("api-docs", app, openapiDocument);

  // Run server
  const SERVER_PORT = customConfigService.get<number>(ENV_KEY.SERVER_PORT) || 3000;
  await app.listen(SERVER_PORT);
}
bootstrap();
