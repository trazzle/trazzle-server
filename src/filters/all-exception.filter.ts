import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // @ts-ignore
    this.logger.error(exception.stack);

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      path: request.url,
      timestamp: new Date().toISOString(),
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      errorMessage: "Internal Server Error",
      errorDetails: "Internal Server Error",
    });
  }
}
