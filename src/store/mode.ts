import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ModeComp, ModePrac } from "../types/const";

const modeSlice = createSlice({
  name: "mode",
  initialState: "",
  reducers: {
    setModePrac: (state) => {
      state = ModePrac;
    },
    setModeComp: (state) => {
      state = ModeComp;
    },
  },
});

export const { setModePrac, setModeComp } = modeSlice.actions;
export default modeSlice.reducer;
