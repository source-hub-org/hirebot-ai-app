import { create } from 'zustand';

type Answer = {
  questionId: string;
  answer: string;
  score?: number;
};

type CandidateDetail = {
  full_name: string;
  phone_number: string;
  email: string;
  hometown: string;
  answers: Answer[];
  interview_level: string,
  _id: string,
};

type CandidateDetailStore = {
  candidate: CandidateDetail | null;
  setCandidate: (candidate: CandidateDetail) => void;
  clearCandidate: () => void;
  addAnswer: (answer: Answer) => void;
  updateAnswer: (questionId: string, update: Partial<Answer>) => void;
};

export const useCandidateDetailStore = create<CandidateDetailStore>((set) => ({
  candidate: null,
  
  setCandidate: (candidate) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentCandidate', JSON.stringify(candidate));
    }
    set({ candidate });
  },
  
  clearCandidate: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentCandidate');
    }
    set({ candidate: null });
  },
  
  addAnswer: (answer) => set(state => ({
    candidate: state.candidate ? {
      ...state.candidate,
      answers: [...state.candidate.answers, answer]
    } : null
  })),
  
  updateAnswer: (questionId, update) => set(state => ({
    candidate: state.candidate ? {
      ...state.candidate,
      answers: state.candidate.answers.map(a => 
        a.questionId === questionId ? { ...a, ...update } : a
      )
    } : null
  }))
}));
