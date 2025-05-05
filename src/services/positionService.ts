import apiClient from "./apiClient";
import { ApiResponse } from "@/types/common";
import { Position } from "@/constants/position";
import { AxiosError } from "axios";

export interface PositionsService {
  createPosition(position: Partial<Position>): Promise<ApiResponse<Position>>;
  getPositions(params: { page: number; limit: number }): Promise<ApiResponse<Position[]>>;
  updatePosition(id: string, position: Partial<Position>): Promise<ApiResponse<Position>>;
  deletePosition(id: string): Promise<void>;
}

const positionsService: PositionsService = {
  async createPosition(position: Partial<Position>): Promise<ApiResponse<Position>> {
    try {
      const response = await apiClient.post<ApiResponse<Position>>("/api/positions", position);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<Position>>;
      console.error("Error creating position:", axiosError.response?.data?.error);
      throw error;
    }
  },

  async getPositions(params: { page: number; limit: number }): Promise<ApiResponse<Position[]>> {
    try {
      const response = await apiClient.get<ApiResponse<Position[]>>("/api/positions", { params });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<Position[]>>;
      console.error("Error fetching positions:", axiosError.response?.data?.error);
      return {
        success: false,
        error: {
          message: axiosError.response?.data?.error?.message || "Failed to fetch positions",
          status: axiosError.response?.status,
          data: []
        }
      };
    }
  },

  async updatePosition(id: string, position: Partial<Position>): Promise<ApiResponse<Position>> {
    try {
      const response = await apiClient.put<ApiResponse<Position>>(`/api/positions/${id}`, position);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<Position>>;
      console.error("Error updating position:", axiosError.response?.data?.error);
      throw error;
    }
  },

  async deletePosition(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/positions/${id}`);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Error deleting position:", axiosError.response?.data);
      throw error;
    }
  }
};

export default positionsService;