import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CurrentChart, IntervalCharts, OneChart } from "../types/types";
import { fifM, fourH, oneD, oneH } from "../types/const";

const defaultChart: OneChart = {
  pdata: [],
  vdata: [],
};

const initialState: IntervalCharts = {
  oneDay: defaultChart,
  fourHours: defaultChart,
  oneHour: defaultChart,
  fifteenMinutes: defaultChart,
};

const intervalChartsSlice = createSlice({
  name: "intervalCharts",
  initialState,
  reducers: {
    initIntervalCharts: (state) => {
      state.oneDay = defaultChart;
      state.fourHours = defaultChart;
      state.oneHour = defaultChart;
      state.fifteenMinutes = defaultChart;
    },
    setIntervalCharts: (state, action: PayloadAction<CurrentChart>) => {
      switch (action.payload.interval) {
        case oneD:
          state.oneDay.pdata = action.payload.oneChart.pdata;
          state.oneDay.vdata = action.payload.oneChart.vdata;
          break;
        case fourH:
          state.fourHours.pdata = action.payload.oneChart.pdata;
          state.fourHours.vdata = action.payload.oneChart.vdata;
          break;
        case oneH:
          state.oneHour.pdata = action.payload.oneChart.pdata;
          state.oneHour.vdata = action.payload.oneChart.vdata;
          break;
        case fifM:
          state.fifteenMinutes.pdata = action.payload.oneChart.pdata;
          state.fifteenMinutes.vdata = action.payload.oneChart.vdata;
          break;
        default:
          console.error(`invalid interval : ${action.payload.interval}`);
          break;
      }
    },
    appendIntervalChart: (state, action: PayloadAction<CurrentChart>) => {
      switch (action.payload.interval) {
        case oneD:
          state.oneDay.pdata = [
            ...state.oneDay.pdata,
            ...action.payload.oneChart.pdata,
          ];
          state.oneDay.vdata = [
            ...state.oneDay.vdata,
            ...action.payload.oneChart.vdata,
          ];
          break;
        case fourH:
          state.fourHours.pdata = [
            ...state.fourHours.pdata,
            ...action.payload.oneChart.pdata,
          ];
          state.fourHours.vdata = [
            ...state.fourHours.vdata,
            ...action.payload.oneChart.vdata,
          ];
          break;
        case oneH:
          state.oneHour.pdata = [
            ...state.oneHour.pdata,
            ...action.payload.oneChart.pdata,
          ];
          state.oneHour.vdata = [
            ...state.oneHour.vdata,
            ...action.payload.oneChart.vdata,
          ];
          break;
        case fifM:
          state.fifteenMinutes.pdata = [
            ...state.fifteenMinutes.pdata,
            ...action.payload.oneChart.pdata,
          ];
          state.fifteenMinutes.vdata = [
            ...state.fifteenMinutes.vdata,
            ...action.payload.oneChart.vdata,
          ];
          break;
        default:
          console.error(`invalid interval : ${action.payload.interval}`);
          break;
      }
    },
  },
});

export const { initIntervalCharts, setIntervalCharts, appendIntervalChart } =
  intervalChartsSlice.actions;
export default intervalChartsSlice.reducer;