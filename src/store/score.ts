import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Score } from "../types/types";

const initialState: Score = {
  stage: 0,
  name: "",
  leverage: 0,
  entry_price: 0,
  profit_price: 0,
  loss_price: 0,
  end_price: 0,
  out_time: 0,
  roe: 0,
  pnl: 0,
  commission: 0,
  is_liquidated: false,
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

export const { setScore: setIsEng } = scoreSlice.actions;
export default scoreSlice.reducer;
