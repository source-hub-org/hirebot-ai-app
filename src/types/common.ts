export interface ApiError {
  message: string;
  status?: number;
  data?: [];
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  success: boolean;
  message?: string;
  pagination?: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
}
