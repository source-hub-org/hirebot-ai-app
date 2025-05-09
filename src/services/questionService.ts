import { Answer } from "@/types/candidate";
import apiClient from "./apiClient";
import { ApiResponse } from "@/types/common";

export interface SearchQuestionsParams {
  language: string;
  position: string;
  topic: string;
  page_size: number;
  page: number;
  mode: string,
  sort_by: string,
  sort_direction: string
}

export interface AddQuestionParams {
  content: string;
  topic: string;
  language: string;
  position: string;
  options: string[];
  correctAnswer: number;
}

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
  
  async addQuestion(
    params: AddQuestionParams
  ): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.post("/api/questions", params);
      return response.data;
    } catch (error) {
      console.error("Error adding question:", error);
      throw error;
    }
  },
};

export default questionService;
