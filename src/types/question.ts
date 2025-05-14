import { Chose } from "./candidate";

export interface Question {
  _id: string;
  question?: string;
  questionText?: string;
  options?: string[];
  choices?: Chose[];
  correctAnswer?: number;
  explanation?: string;
  topic?: string;
  language?: string;
  position?: string;
  type?: string; // For UI compatibility
  level?: string | number; // For UI compatibility
  difficulty?: string;
  category?: string;
  positionLevel?: number;
  answer_explanation?: string;
  typeFe?: string;
  tag_ids?: Tag[] | string[];
  levelFe?: string | number;
  tags?: Tag[] | string[];
}
export interface Tag {
  _id?: string;
  name?: string;
  slug?: string;
}
