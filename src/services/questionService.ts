import { Answer } from "@/types/candidate";
import apiClient from "./apiClient";
import { ApiResponse } from "@/types/common";
import {
  SearchQuestionsParams,
  GenerateQuestionsParams,
} from "@/types/questionService";
import { Question } from "@/types/question";

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
    params: AddQuestionParams,
  ): Promise<ApiResponse<{ id: string }>> {
    try {
      const response = await apiClient.post("/api/questions", params);
      return response.data;
    } catch (error) {
      console.error("Error adding question:", error);
      throw error;
    }
  },

  async generateQuestions(
    params: GenerateQuestionsParams,
  ): Promise<ApiResponse<Answer[]>> {
    try {
      const response = await apiClient.post("/api/questions/generate", params);
      return response.data;
    } catch (error) {
      console.error("Error generating questions:", error);
      throw error;
    }
  },
  async updateQuestion(params: Question): Promise<ApiResponse<Answer[]>> {
    try {
      const response = await apiClient.put(
        `/api/questions/${params._id}`,
        params,
      );
      return response.data;
    } catch (error) {
      console.error("Error generating questions:", error);
      throw error;
    }
  },
  async deleteQuestion(questionId: string): Promise<ApiResponse<Answer[]>> {
    try {
      const response = await apiClient.delete(`/api/questions/${questionId}`);
      return response.data;
    } catch (error) {
      console.error("Error generating questions:", error);
      throw error;
    }
  },
};

export default questionService;
