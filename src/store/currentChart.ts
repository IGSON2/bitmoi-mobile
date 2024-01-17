import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CurrentChart } from "../types/types";
import { oneH } from "../types/const";

const defaultInfo: CurrentChart = {
  interval: oneH,
  oneChart: {
    pdata: [],
    vdata: [],
  },
};

const initialState = defaultInfo;

const currentChartSlice = createSlice({
  name: "currentChart",
  initialState,
  reducers: {
    setCurrentChart: (state, action: PayloadAction<CurrentChart>) => {
      state.interval = action.payload.interval;
      state.oneChart.pdata = action.payload.oneChart.pdata;
      state.oneChart.vdata = action.payload.oneChart.vdata;
    },
  },
});

export const { setCurrentChart } = currentChartSlice.actions;
export default currentChartSlice.reducer;
