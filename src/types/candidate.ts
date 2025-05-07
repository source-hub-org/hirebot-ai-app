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
  createdAt?: string;
  updated_at?: string;
};

export type Answer = {
  _id?: string;
  id?: string;
  questionId?: string;
  options: string[];
  correctAnswer: number;
  selectedAnswer?: number;
  otherAnswer?: string;
  is_skip?: number; // 1 nếu bỏ qua, 0 nếu không bỏ qua
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
  question :string;
  sessionId?: number; 
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
  title: string;
  difficulty: number;
  popularity: string;
  suitable_level: string;
  description: string;
};

export type QuestionDetail = {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: string;
  category: string;
  topic: string;
};

export type SubmissionAnswer = {
  question_id: string;
  answer: number | null;
  other: string;
  is_skip: number;
  question: QuestionDetail;
};

export type EssayQuestion = {
  question: string;
  answer: string;
  is_skip: number;
};

export type ReviewStatus = {
  comment: string;
  status: string;
};

export type CandidateSubmission = {
  _id: string;
  candidate_id: string;
  answers: SubmissionAnswer[];
  essay: EssayQuestion;
  review: ReviewStatus;
  candidate: Candidate;
};

export type Session = {
  id: number;
  language: string;
  position: string;
  topic: string;
  questionCount: number;
  createdAt: string;
};
