import { Answer } from "./candidate";
import { ApiResponse } from "./common";

export interface SearchQuestionsParams {
  language?: string;
  position?: string;
  topic?: string;
  page_size?: number;
  page: number;
  mode?: string;
  sort_by?: string;
  sort_direction?: string;
  ignore_question_ids?: string;
  ignore_instrument_ids?: string;
  limit?: number;
}

export interface GenerateQuestionsParams {
  language: string;
  position: string;
  topic: string;
  count: number;
}

export interface EditQuestion {
  _id?: string;
  question: string;
  options: string[];
  explanation?: string;
  difficulty?: string;
  category?: string;
  topic?: string;
  language?: string;
  position?: string;
  positionLevel?: string;
}

export interface QuestionService {
  searchQuestions(
    params: SearchQuestionsParams
  ): Promise<ApiResponse<Answer[]>>;
  
  generateQuestions(
    params: GenerateQuestionsParams
  ): Promise<ApiResponse<Answer[]>>;

  updateQuestion(
    params: EditQuestion
  ): Promise<ApiResponse<Answer[]>>;
}
