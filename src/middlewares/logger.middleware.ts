import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);

  constructor() {}

  use(request: Request, response: Response, next: NextFunction) {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get("user-agent") || "";
    const startTime = new Date().getTime();

    this.logger.log(`${method} ${originalUrl} - ${userAgent} ${ip}`);

    response.on("finish", () => {
      const { statusCode } = response;
      const endTime = new Date().getTime();

      if (statusCode >= 400 && statusCode < 600) {
        this.logger.error(
          `${method} ${originalUrl} ${statusCode} query=${JSON.stringify(request.query)} param=${JSON.stringify(request.params)} body=${JSON.stringify(request.body)} - ${userAgent} ${ip} ${endTime - startTime} ms`,
        );
      } else {
        this.logger.log(`${method} ${originalUrl} ${statusCode} - ${userAgent} ${ip} ${endTime - startTime} ms`);
      }
    });
    next();
  }
}
