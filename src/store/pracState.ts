import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { PracState } from "../types/types";

const initialState: PracState = {
  name: "",
  stage: 1,
  balance: 1000,
  entryPrice: 0,
  identifier: "",
  score_id: "",
};

const pracStateSlice = createSlice({
  name: "pracState",
  initialState: initialState,
  reducers: {
    setPracName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setPracStage: (state, action: PayloadAction<number>) => {
      state.stage = action.payload;
    },
    setPracBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload;
    },
    setPracEntryPrice: (state, action: PayloadAction<number>) => {
      state.entryPrice = action.payload;
    },
    setPracIdentifier: (state, action: PayloadAction<string>) => {
      state.identifier = action.payload;
    },
    setPracScoreId: (state, action: PayloadAction<string>) => {
      state.score_id = action.payload;
    },
  },
});

export const {
  setPracName,
  setPracStage,
  setPracBalance,
  setPracEntryPrice,
  setPracIdentifier,
  setPracScoreId,
} = pracStateSlice.actions;
export default pracStateSlice.reducer;
