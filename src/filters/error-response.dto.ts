export interface ErrorResponseDto {
  path: string;
  timestamp: string;
  statusCode: number;
  errorMessage: string;
  errorDetails: string;
}
