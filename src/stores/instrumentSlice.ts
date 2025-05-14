import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { InstrumentTag } from "../types/instrument";

interface InstrumentState {
  instrumentTags: InstrumentTag[];
}

const initialState: InstrumentState = {
  instrumentTags: [],
};

export const instrumentSlice = createSlice({
  name: "instrument",
  initialState,
  reducers: {
    setInstrumentTags: (state, action: PayloadAction<InstrumentTag[]>) => {
      state.instrumentTags = action.payload;
    },
  },
});

export const { setInstrumentTags } =
  instrumentSlice.actions;

export const selectInstrumentTags = (state: { instrument: InstrumentState }) =>
  state.instrument?.instrumentTags;

export default instrumentSlice.reducer;
