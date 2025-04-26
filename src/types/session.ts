export interface Session {
  id: number;
  createdAt: string;
  language: string;
  level: string;
  topic: string;
  questionCount: number;
}

export interface SessionFormData {
  language: string;
  level: string;
  topic: string;
  questionCount: number;
}

export interface PageProps {
  params: {
    id: string;
  };
}
