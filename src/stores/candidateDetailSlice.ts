import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CandidateDetail, Answer, Topic } from '@/types/candidate';

interface CandidateDetailState {
  candidate: CandidateDetail | null;
  topics: Topic[] | null;
}

const initialState: CandidateDetailState = {
  candidate: typeof window !== 'undefined' 
    ? JSON.parse(localStorage.getItem('currentCandidate') || 'null')
    : null,
  topics: typeof window !== 'undefined' 
  ? JSON.parse(localStorage.getItem('topics') || 'null')
  : null,
};

export const candidateDetailSlice = createSlice({
  name: 'candidateDetail',
  initialState,
  reducers: {
    setCandidate: (state, action: PayloadAction<CandidateDetail>) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentCandidate', JSON.stringify(action.payload));
      }
      state.candidate = action.payload;
    },
    setTopic: (state, action: PayloadAction<Topic[]>) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('topics', JSON.stringify(action.payload));
      }
      state.topics = action.payload;
    },
    clearCandidate: (state) => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('currentCandidate');
      }
      state.candidate = null;
    },
    addAnswer: (state, action: PayloadAction<Answer>) => {
      if (state.candidate) {
        state.candidate.answers = [...state.candidate.answers, action.payload];
        if (typeof window !== 'undefined') {
          localStorage.setItem('currentCandidate', JSON.stringify(state.candidate));
        }
      }
    },
    updateAnswer: (state, action: PayloadAction<{questionId: string; update: Partial<Answer>}>) => {
      if (state.candidate) {
        state.candidate.answers = state.candidate.answers.map(a => 
          a.questionId === action.payload.questionId ? {...a, ...action.payload.update} : a
        );
        if (typeof window !== 'undefined') {
          localStorage.setItem('currentCandidate', JSON.stringify(state.candidate));
        }
      }
    }
  }
});

export const { setCandidate, clearCandidate, addAnswer, updateAnswer, setTopic } = candidateDetailSlice.actions;
export default candidateDetailSlice.reducer;
