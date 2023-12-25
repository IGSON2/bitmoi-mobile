import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const charLoadedSlice = createSlice({
  name: "mode",
  initialState: false,
  reducers: {
    setChartLoaded: (state, action: PayloadAction<boolean>) => {
      state = action.payload;
    },
  },
});

export const { setChartLoaded } = charLoadedSlice.actions;
export default charLoadedSlice.reducer;
