import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { StageState } from "../types/stageState";

const defaultInfo: StageState = {
  name: "",
  btcratio: 0,
  entrytime: 0,
  titleArray: [],
  elapsed_time: 0,
  roe_array: [],
  refresh_cnt: 0,
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
      state.roe_array = [];
    },
    setStateTitleArray: (state, action: PayloadAction<string>) => {
      state.titleArray = [...state.titleArray, action.payload];
      if (state.titleArray.length > 10) {
        state.titleArray = [action.payload];
      }
    },
    setElapsedTime: (state, action: PayloadAction<number>) => {
      state.elapsed_time = action.payload;
    },
    setAppendRoeArray: (state, action: PayloadAction<number>) => {
      state.roe_array = [...state.roe_array, action.payload];
    },
    setAddRefreshCnt: (state) => {
      state.refresh_cnt += 1;
    },
  },
});

export const {
  setStageState,
  setStateTitleArray,
  setElapsedTime,
  setAppendRoeArray,
  setAddRefreshCnt,
} = stageStateSlice.actions;
export default stageStateSlice.reducer;
