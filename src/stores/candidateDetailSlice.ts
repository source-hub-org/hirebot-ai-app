import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CandidateDetail, Answer, Topic, Session } from "@/types/candidate";

interface CandidateDetailState {
  candidate: CandidateDetail | null;
  topics: Topic[] | null;
}

const initialState: CandidateDetailState = {
  candidate: null,
  topics: null,
};

export const candidateDetailSlice = createSlice({
  name: "candidateDetail",
  initialState,
  reducers: {
    setCandidate: (state, action: PayloadAction<CandidateDetail>) => {
      state.candidate = action.payload;
    },
    setTopic: (state, action: PayloadAction<Topic[]>) => {
      state.topics = action.payload;
    },
    addAnswer: (state, action: PayloadAction<Answer>) => {
      if (!state.candidate) return;
      state.candidate.answers = [
        ...(state.candidate.answers || []),
        action.payload,
      ];
    },
    clearCandidate: (state) => {
      state.candidate = null;
    },
    updateAnswer: (
      state,
      action: PayloadAction<{ questionId: string; update: Partial<Answer> }>,
    ) => {
      if (state.candidate) {
        state.candidate.answers = state.candidate.answers.map((a) =>
          a.questionId === action.payload.questionId
            ? { ...a, ...action.payload.update }
            : a,
        );
      }
    },
    removeAnswersBySession: (state, action: PayloadAction<Session>) => {
      if (state.candidate) {
        state.candidate.answers = state.candidate.answers?.filter(
          (answer) => answer.sessionId !== action.payload.id
        ) || [];
      }
    },
  },
});

export const {
  setCandidate,
  setTopic,
  addAnswer,
  clearCandidate,
  updateAnswer,
  removeAnswersBySession,
} = candidateDetailSlice.actions;
export default candidateDetailSlice.reducer;
