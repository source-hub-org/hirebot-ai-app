import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Language } from "../constants/language";

interface LanguageState {
  languages: Language[];
}

const initialState: LanguageState = {
  languages: [],
};

export const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguages: (state, action: PayloadAction<Language[]>) => {
      state.languages = action.payload;
    },
    addLanguage: (state, action: PayloadAction<Language>) => {
      state.languages.push(action.payload);
    },
    updateLanguage: (state, action: PayloadAction<Language>) => {
      const index = state.languages.findIndex(
        (l) => l._id === action.payload._id,
      );
      if (index !== -1) {
        state.languages[index] = action.payload;
      }
    },
    removeLanguage: (state, action: PayloadAction<string>) => {
      state.languages = state.languages.filter((l) => l._id !== action.payload);
    },
  },
});

export const { setLanguages, addLanguage, updateLanguage, removeLanguage } =
  languageSlice.actions;

export const selectLanguages = (state: { language: LanguageState }) =>
  state.language?.languages;

export default languageSlice.reducer;
