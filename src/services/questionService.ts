import { Answer } from "@/types/candidate";
import apiClient from "./apiClient";
import { ApiResponse } from "@/types/common";
import {
  SearchQuestionsParams,
  GenerateQuestionsParams,
} from "@/types/questionService";

const questionService = {
  async searchQuestions(
    params: SearchQuestionsParams,
  ): Promise<ApiResponse<Answer[]>> {
    try {
      const response = await apiClient.get("/api/questions/search", { params });
      return response.data;
    } catch (error) {
      console.error("Error searching questions:", error);
      throw error;
    }
  },

  async generateQuestions(
    params: GenerateQuestionsParams
  ): Promise<ApiResponse<Answer[]>> {
    try {
      const response = await apiClient.post("/api/questions/generate", params);
      return response.data;
    } catch (error) {
      console.error("Error generating questions:", error);
      throw error;
    }
  }
};

export default questionService;
