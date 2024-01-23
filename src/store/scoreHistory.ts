import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ScoreHistory } from "../types/types";

const initialState: ScoreHistory = {
  stage: 0,
  pairname: "",
  position: "",
  leverage: 0,
  entryprice: 0,
  endprice: 0,
  out_time: 0,
  roe: 0,
  pnl: 0,
  commission: 0,
  is_liquidated: false,
  created_at: "",
};

const scoreHistorySlice = createSlice({
  name: "scoreHistory",
  initialState,
  reducers: {
    setScoreHistory: (state, action: PayloadAction<ScoreHistory>) => {
      state = action.payload;
    },
  },
});

export const { setScoreHistory } = scoreHistorySlice.actions;
export default scoreHistorySlice.reducer;
