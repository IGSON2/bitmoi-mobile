import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CurrentChart } from "../types/types";
import { oneH } from "../types/const";

const defaultInfo: CurrentChart = {
  interval: oneH,
  oneChart: {
    pdata: [
      {
        close: 0,
        high: 0,
        low: 0,
        open: 0,
        time: "",
      },
    ],
    vdata: [
      {
        value: 0,
        time: "",
        color: "",
      },
    ],
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
    appendCurrentChart: (state, action: PayloadAction<CurrentChart>) => {
      if (state.interval !== action.payload.interval) {
        console.error(
          `interval is not same. current : ${state.interval}, req : ${action.payload.interval}`
        );
        return;
      }
      state.oneChart.pdata = [
        ...state.oneChart.pdata,
        ...action.payload.oneChart.pdata,
      ];
      state.oneChart.vdata = [
        ...state.oneChart.vdata,
        ...action.payload.oneChart.vdata,
      ];
    },
  },
});

export const { setCurrentChart, appendCurrentChart } =
  currentChartSlice.actions;
export default currentChartSlice.reducer;
