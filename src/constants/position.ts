export interface Position {
  _id: string;
  slug: string;
  title: string;
  description: string;
  instruction: string;
  requirements: string[];
  status: 'open' | 'closed' | 'on-hold';
  level: number;
  is_active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const initialPosition: Position = {
  _id: "",
  slug: "",
  title: "",
  description: "",
  instruction: "",
  requirements: [],
  status: 'open',
  level: 1,
  is_active: true,
};
