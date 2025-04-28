export type Candidate = {
  _id?: string;
  full_name?: string;
  email?: string;
  phone_number?: string;
  interview_level?: string;
  gender?: string;
  skills?: string[];
  programming_languages?: string[];
  preferred_stack?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
};

export type Answer = {
  _id?: string;
  id?: string;
  questionId?: string;
  content: string;
  options: string[];
  correctAnswer: number;
  selectedAnswer?: number;
  otherAnswer?: string;
  is_skip?: number;  // 1 nếu bỏ qua, 0 nếu không bỏ qua
  language: string;
  level: string;
  category: string;
  explanation?: string;
  difficulty?: string;
  topic?: string;
  position?: string;
  positionLevel?: number;
  score?: number;
  feedback?: string;
  category: string;
  options: string[],
  position: string,
  positionLevel: string,
  topic: string

};

export type CandidateDetail = Candidate & {
  answers: Answer[];
};

export type CandidatesResponse = {
  success: boolean;
  data: Candidate[];
  pagination: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
};
export type Topic = {
  title: string,
  difficulty: number,
  popularity: string,
  suitable_level: string,
  description: string
}