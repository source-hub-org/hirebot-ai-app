import { Answer } from "@/types/candidate";
import apiClient from "./apiClient";
import { ApiResponse } from "@/types/common";
import { SearchQuestionsParams } from "@/types/questionService";

const instrumentService = {
  async get(params: SearchQuestionsParams): Promise<ApiResponse<Answer[]>> {
    try {
      const response = await apiClient.get("/api/instruments", { params });
      return response.data;
    } catch (error) {
      console.error("Error searching questions:", error);
      throw error;
    }
  },
  async update(params: Answer): Promise<ApiResponse<Answer[]>> {
    try {
      const response = await apiClient.put(
        `/api/instruments/${params._id}`,
        params,
      );
      return response.data;
    } catch (error) {
      console.error("Error searching questions:", error);
      throw error;
    }
  },
  async delete(questionId: string): Promise<ApiResponse<Answer[]>> {
    try {
      const response = await apiClient.delete(`/api/instruments/${questionId}`);
      return response.data;
    } catch (error) {
      console.error("Error generating questions:", error);
      throw error;
    }
  },
};

export default instrumentService;
