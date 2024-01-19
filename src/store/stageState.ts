import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { StageState } from "../types/types";

const defaultInfo: StageState = {
  name: "",
  btcratio: 0,
  entrytime: 0,
  titleArray: [],
};

const initialState = defaultInfo;

const stageStateSlice = createSlice({
  name: "stageState",
  initialState,
  reducers: {
    setStageState: (state, action: PayloadAction<StageState>) => {
      state.name = action.payload.name;
      state.btcratio = action.payload.btcratio;
      state.entrytime = action.payload.entrytime;
    },
    setStateTitleArray: (state, action: PayloadAction<string>) => {
      state.titleArray = [...state.titleArray, action.payload];
      if (state.titleArray.length > 10) {
        state.titleArray = [action.payload];
      }
    },
  },
});

export const { setStageState, setStateTitleArray } = stageStateSlice.actions;
export default stageStateSlice.reducer;