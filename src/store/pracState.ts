import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { PracState } from "../types/types";

const initialState: PracState = {
  balance: 1000,
  entryPrice: 0,
};

const pracStateSlice = createSlice({
  name: "pracState",
  initialState: initialState,
  reducers: {
    setPracBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload;
    },
    setPracEntryPrice: (state, action: PayloadAction<number>) => {
      state.entryPrice = action.payload;
    },
  },
});

export const { setPracBalance, setPracEntryPrice } = pracStateSlice.actions;
export default pracStateSlice.reducer;
