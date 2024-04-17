import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from "@nestjs/common";
import { Request, Response } from "express";
import { ErrorResponseDto } from "src/filters/error-response.dto";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    
    this.logger.error(exceptionResponse, exception.stack);

    const body: ErrorResponseDto = {
      path: request.url,
      timestamp: new Date().toISOString(),
      statusCode: statusCode,
      errorMessage: exceptionResponse["error"] || exception.message,
      errorDetails: Array.isArray(exceptionResponse["message"])
        ? exceptionResponse["message"].join("\r\n")
        : exceptionResponse["message"],
    };

    response.status(body.statusCode).json(body);
  }
}
