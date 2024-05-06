// logger.module.ts
import { Module } from "@nestjs/common";
import { WinstonModule } from "nest-winston";
import * as winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { enhanceLogLevel } from "src/modules/core/logger/logger.helper";

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          level: "debug",
          format: winston.format.combine(
            winston.format.timestamp({
              format: "YYYY. MM. DD. A hh:mm:ss",
            }),
            winston.format.colorize({
              all: true,
            }),
            // winston.format.printf(({ level, message, timestamp, context }) => {
            winston.format.printf(({ level, message, timestamp, context }) => {
              return `[Nest] ${process.pid}  - ${timestamp}     ${enhanceLogLevel(level)} [${context || "Context not available"}] ${message}`;
            }),
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
