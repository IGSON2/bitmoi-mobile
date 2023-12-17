import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const langSlice = createSlice({
  name: "account",
  initialState: {
    isEng: false,
  },
  reducers: {
    setIsEng: (state, action: PayloadAction<boolean>) => {
      state.isEng = action.payload;
    },
  },
});

export const { setIsEng } = langSlice.actions;
export default langSlice.reducer;
