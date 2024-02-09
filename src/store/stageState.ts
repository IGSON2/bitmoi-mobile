import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { StageState, SubmitState } from "../types/stageState";

const defaultInfo: StageState = {
  name: "",
  btcratio: 0,
  entrytime: 0,
  titleArray: [],
  elapsed_time: 0,
  roe_array: [],
  refresh_cnt: 0,
  min_timestamp: 0,
  max_timestamp: 0,
  submitState: SubmitState.NotSubmit,
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
      state.min_timestamp = action.payload.min_timestamp;
      state.submitState = SubmitState.NotSubmit;
    },
    setStageTitleArray: (state, action: PayloadAction<string>) => {
      state.titleArray = [...state.titleArray, action.payload];
      if (state.titleArray.length > 10) {
        state.titleArray = [action.payload];
      }
    },
    setStageElapsedTime: (state, action: PayloadAction<number>) => {
      state.elapsed_time = action.payload;
    },
    setStageAppendRoeArray: (state, action: PayloadAction<number>) => {
      state.roe_array = [...state.roe_array, action.payload];
    },
    setStageAddRefreshCnt: (state) => {
      state.refresh_cnt += 1;
    },
    setStageSubmitState: (state, action: PayloadAction<SubmitState>) => {
      state.submitState = action.payload;
    },
  },
});

export const {
  setStageState,
  setStageTitleArray,
  setStageElapsedTime,
  setStageAppendRoeArray,
  setStageAddRefreshCnt,
  setStageSubmitState,
} = stageStateSlice.actions;
export default stageStateSlice.reducer;
