export interface Question {
    _id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
    topic: string;
    language: string;
    position: string;
    type?: string; // For UI compatibility
    level?: string; // For UI compatibility
    difficulty?: string;
    category?: string;
    positionLevel?: number;
  }