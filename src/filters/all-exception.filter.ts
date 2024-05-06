import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { method, originalUrl } = request;

    let stack = "No stack trace available";
    if (typeof exception === "object" && exception !== null && "stack" in exception) {
      stack = (exception as Error).stack || "Stack unavailable";
    }

    try {
      const message = `${method} ${originalUrl} query=${JSON.stringify(request.query)} param=${JSON.stringify(request.params)} body=${JSON.stringify(request.body)} ${stack}`;
      this.logger.error(message);
    } catch (e) {
      this.logger.error(exception);
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      path: request.url,
      timestamp: new Date().toISOString(),
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      errorMessage: "Internal Server Error",
      errorDetails: "Internal Server Error",
    });
  }
}
