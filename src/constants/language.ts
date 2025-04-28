export interface Language {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  level?: number;
  createdAt?: string;
  updatedAt?: string;
}

export const initialLanguage: Language = {
  _id: '',
  name: '',
  description: '',
  category: '',
  level: 1
};
