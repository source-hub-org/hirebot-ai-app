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

export interface Filters {
  type: string;
  topic: string;
  language: string;
  position: string;
  sort_by: string;
  sort_direction: string;
  mode: string;
}
