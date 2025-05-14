import { SessionFormData } from "./session";

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
  filter_fe?: SessionFormData | null;
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
  point?: number; // Added for storing points
  customPoint?: number; // Added for custom point assignment
  feedback?: string;
  question: string;
  sessionId?: number;
  questionText?: string;
  choices?: Chose[];
  type?: string;
  answer_explanation?: string;
};
export type Chose = {
  text: string;
  is_correct: boolean;
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
  point?: number;
  question: QuestionDetail;
};

export type InstrumentDetail = {
  _id: string;
  questionId: string;
  questionText: string;
  type: string;
  options: string[];
  tags: string[];
};

export type Instrument = {
  instrument_id: string;
  answer: number | null;
  other: string;
  point: number;
  is_skip: number;
  instrument: InstrumentDetail;
};

export type LogicQuestionChoice = {
  text: string;
  is_correct: boolean;
};

export type LogicQuestionDetail = {
  _id: string;
  question: string;
  level: number;
  tag_ids: string[];
  type: string;
  choices: LogicQuestionChoice[];
  answer_explanation: string;
};

export type LogicQuestion = {
  logic_question_id: string;
  answer: string;
  other: string;
  point: number;
  is_skip: number;
  logic_question: LogicQuestionDetail;
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
  instruments: Instrument[];
  logic_questions: LogicQuestion[];
  essay: EssayQuestion;
  review: ReviewStatus;
  candidate: Candidate;
  createdAt?: string;
  created_at?: string;
};

export type Session = {
  id: number;
  language: string;
  position: string;
  topic: string;
  questionCount: number;
  createdAt: string;
};
