export type Candidate = {
  id?: string;
  full_name: string;
  email: string;
  phone_number: string;
  interview_level: string;
  gender: string;
  skills?: string[];
  programming_languages?: string[];
  preferred_stack: string ;
  status?: 'pending' | 'interviewed' | 'hired' | 'rejected';
  date?: string;
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
