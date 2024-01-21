import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const positionClosedSlice = createSlice({
  name: "positionClosed",
  initialState: { closed: false },
  reducers: {
    setPositionClosed: (state, action: PayloadAction<boolean>) => {
      state.closed = action.payload;
    },
  },
});

export const { setPositionClosed } = positionClosedSlice.actions;
export default positionClosedSlice.reducer;
