export interface SuccessResponse {
  message: string;
}

export interface ErrorResponse {
  error: string;
}

export type LambdaResponse = SuccessResponse | ErrorResponse;
