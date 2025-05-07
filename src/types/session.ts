export interface Session {
  id: number;
  createdAt: string;
  language: string;
  position: string;
  topic: string;
  questionCount: number;
}

export interface SessionFormData {
  language: string;
  position: string;
  topic: string;
  questionCount: number;
}

export interface PageProps {
  params: {
    id: string;
  };
}
