export interface AnswerOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  questionText: string;
  options: AnswerOption[];
  allowCustomAnswer: boolean;
  isRequired: boolean;
}

export interface InterviewAnswer {
  questionId: string;
  answer: string | null;
  timestamp: Date;
}
