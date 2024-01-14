import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const submitSlice = createSlice({
  name: "submit",
  initialState: { check: false },
  reducers: {
    setSubmit: (state, action: PayloadAction<boolean>) => {
      state.check = action.payload;
    },
  },
});

export const { setSubmit } = submitSlice.actions;
export default submitSlice.reducer;
