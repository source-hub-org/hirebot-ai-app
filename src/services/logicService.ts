import { Answer } from "@/types/candidate";
import apiClient from "./apiClient";
import { ApiResponse } from "@/types/common";
import {
  SearchQuestionsParams,
} from "@/types/questionService";

const logicService = {
  async get(
    params: SearchQuestionsParams,
  ): Promise<ApiResponse<Answer[]>> {
    try {
      const response = await apiClient.get("/api/logic-questions", { params });
      return response.data;
    } catch (error) {
      console.error("Error searching questions:", error);
      throw error;
    }
  },
  async update(
    params: Answer,
  ): Promise<ApiResponse<Answer[]>> {
    try {
      const response = await apiClient.put(`/api/logic-questions/${params._id}`, params);
      return response.data;
    } catch (error) {
      console.error("Error searching questions:", error);
      throw error;
    }
  },
};

export default logicService;
