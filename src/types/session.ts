export interface Session {
  id: number;
  createdAt: string;
  language: string;
  position: string;
  topic: string;
  questionCount: number;
  type?: string;
}

export interface SessionFormData {
  language: string;
  position: string;
  topic: string;
  questionCount: number;
  type: string;
}

export interface PageProps {
  params: {
    id: string;
  };
}
