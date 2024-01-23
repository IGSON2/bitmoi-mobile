import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CurrentScore, Score } from "../types/types";

const initialState: Score = {
  after_score: {
    closed_time: 0,
    min_roe: 0,
    max_roe: 0,
  },
  current_score: {
    name: "",
    is_long: true,
    entry_time: "",
    leverage: 0,
    end_price: 0,
    out_time: 0,
    roe: 0,
    pnl: 0,
    commission: 0,
    is_liquidated: false,
  },
};

const scoreSlice = createSlice({
  name: "Score",
  initialState,
  reducers: {
    initScore: (state) => {
      state = initialState;
    },
    setCurrentScore: (state, action: PayloadAction<CurrentScore>) => {
      state.current_score = action.payload;
    },
    setScore: (state, action: PayloadAction<Score>) => {
      if (action.payload.after_score) {
        state.after_score = action.payload.after_score;
      }
      state.current_score = action.payload.current_score;
    },
  },
});

export const { initScore, setCurrentScore, setScore } = scoreSlice.actions;
export default scoreSlice.reducer;
