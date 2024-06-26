import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ScoreHistory } from "../types/types";

const initialState: ScoreHistory[] = [
  {
    stage: 0,
    pairname: "",
    position: "",
    leverage: 0,
    entryprice: 0,
    endprice: 0,
    outtime: 0,
    roe: 0,
    pnl: 0,
    commission: 0,
    is_liquidated: false,
    created_at: "",
    settled_at: { Time: "", Valid: false },
  },
];

const scoreHistorySlice = createSlice({
  name: "scoreHistory",
  initialState,
  reducers: {
    setScoreHistory: (state, action: PayloadAction<ScoreHistory[]>) => {
      state = action.payload;
    },
    setAppendScoreHistory: (state, action: PayloadAction<ScoreHistory[]>) => {
      state.push(...action.payload);
    },
  },
});

export const { setScoreHistory, setAppendScoreHistory } =
  scoreHistorySlice.actions;
export default scoreHistorySlice.reducer;
