export interface ErrorResponseDto {
  path: string;
  timestamp: string;
  statusCode: number;
  // error: string;
  errorMessage: string;
  errorDetails: string;
}
