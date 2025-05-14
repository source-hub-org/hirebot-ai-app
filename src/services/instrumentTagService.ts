import { InstrumentTag } from "@/types/instrument";
import apiClient from "./apiClient";
import { ApiResponse } from "@/types/common";
import {
  SearchQuestionsParams,
} from "@/types/questionService";

const instrumentTagService = {
  async get(
    params: SearchQuestionsParams,
  ): Promise<ApiResponse<InstrumentTag[]>> {
    try {
      const response = await apiClient.get("/api/instrument-tags", { params });
      return response.data;
    } catch (error) {
      console.error("Error searching questions:", error);
      throw error;
    }
  },
};

export default instrumentTagService;
