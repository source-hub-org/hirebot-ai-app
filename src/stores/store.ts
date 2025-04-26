import { configureStore } from '@reduxjs/toolkit';
import candidateDetailReducer from '@/stores/candidateDetailSlice';

export const store = configureStore({
  reducer: {
    candidateDetail: candidateDetailReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
