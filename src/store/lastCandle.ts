import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { PData } from "../types/types";
import { UTCTimestamp } from "lightweight-charts";

const initialState: PData = {
  close: 0,
  high: 0,
  low: 0,
  open: 0,
  time: 0 as UTCTimestamp,
};

const lastCandleSlice = createSlice({
  name: "Score",
  initialState,
  reducers: {
    setLastCandle: (state, action: PayloadAction<PData>) => {
      state.close = action.payload.close;
      state.high = action.payload.high;
      state.low = action.payload.low;
      state.open = action.payload.open;
      state.time = action.payload.time;
    },
  },
});

export const { setLastCandle } = lastCandleSlice.actions;
export default lastCandleSlice.reducer;
