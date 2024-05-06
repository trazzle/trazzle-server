// logger.module.ts
import { Module } from "@nestjs/common";
import { WinstonModule } from "nest-winston";
import * as winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          level: "info", // 콘솔 로그 레벨 설정
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(info => `${info.timestamp} [${info.level.toUpperCase()}] - ${info.message}`),
          ),
        }),
        new DailyRotateFile({
          level: "error",
          filename: "logs/error-%DATE%.log",
          datePattern: "YYYY-MM-DD",
          zippedArchive: true,
          maxSize: "20m",
          maxFiles: "14d",
          format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
        }),
        new DailyRotateFile({
          filename: "logs/app-%DATE%.log",
          datePattern: "YYYY-MM-DD",
          zippedArchive: true,
          maxSize: "20m",
          maxFiles: "14d",
          format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
        }),
      ],
    }),
  ],
  exports: [WinstonModule],
})
export class LoggerModule {}
