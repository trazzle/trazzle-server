import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CustomConfigService } from "./custom-config.service";
import Joi from "joi";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [".production.env", ".env"],
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().default("development"),
        // Mysql
        SERVER_PORT: Joi.number().default(3000),
        DATABASE_URL: Joi.string().required(),
        // Redis
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        // Access token
        JWT_SECRET_KEY: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TTL: Joi.number().default(86400),
        // Refresh Token
        JWT_REFRESH_SECRET_KEY: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TTL: Joi.number().default(86400),
        // OAUTH
        KAKAO_CLIENT_ID: Joi.string().required(),
        KAKAO_SECRET_KEY: Joi.string().required(),
        KAKAO_CALLBACK_URL: Joi.string().required(),
        GOOGLE_CLIENT_ID: Joi.string().required(),
        APPLE_CLIENT_ID: Joi.string().required(),
        // AWS S3 Bucket
        AWS_REGION: Joi.string().required(),
        AWS_ACCESS_KEY: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_S3_BUCKET_NAME: Joi.string().required(),
      }),
    }),
  ],
  providers: [CustomConfigService],
  exports: [ConfigModule, CustomConfigService],
})
export class CustomConfigModule {}
