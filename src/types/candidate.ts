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
  date?: string;
};

export type Answer = {
  _id?: string;
  questionId?: string;
  content: string;
  options: string[];
  correctAnswer: number;
  selectedAnswer?: number;
  otherAnswer?: string;
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
  question?: any;
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