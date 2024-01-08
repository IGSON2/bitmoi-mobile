import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Score } from "../types/types";

const initialState: Score = {
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

const scoreSlice = createSlice({
  name: "score",
  initialState,
  reducers: {
    setScore: (state, action: PayloadAction<Score>) => {
      state = action.payload;
    },
  },
});

export const { setScore } = scoreSlice.actions;
export default scoreSlice.reducer;
