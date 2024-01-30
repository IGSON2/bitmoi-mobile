import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CurrentChart, IntervalCharts, OneChart, PData } from "../types/types";
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
          if (
            !checkLatestTimestamp(
              state.oneDay.pdata,
              action.payload.oneChart.pdata
            )
          ) {
            break;
          }
          state.oneDay.pdata.push(...action.payload.oneChart.pdata);
          state.oneDay.vdata.push(...action.payload.oneChart.vdata);
          break;
        case fourH:
          if (
            !checkLatestTimestamp(
              state.fourHours.pdata,
              action.payload.oneChart.pdata
            )
          ) {
            break;
          }
          state.fourHours.pdata.push(...action.payload.oneChart.pdata);
          state.fourHours.vdata.push(...action.payload.oneChart.vdata);
          break;
        case oneH:
          if (
            !checkLatestTimestamp(
              state.oneHour.pdata,
              action.payload.oneChart.pdata
            )
          ) {
            break;
          }
          state.oneHour.pdata.push(...action.payload.oneChart.pdata);
          state.oneHour.vdata.push(...action.payload.oneChart.vdata);
          break;
        case fifM:
          if (
            !checkLatestTimestamp(
              state.fifteenMinutes.pdata,
              action.payload.oneChart.pdata
            )
          ) {
            break;
          }
          state.fifteenMinutes.pdata.push(...action.payload.oneChart.pdata);
          state.fifteenMinutes.vdata.push(...action.payload.oneChart.vdata);
          break;
        default:
          console.error(`invalid interval : ${action.payload.interval}`);
          break;
      }
    },
  },
});

function checkLatestTimestamp(op: PData[], np: PData[]): boolean {
  return Number(op[op.length - 1].time) < Number(np[0].time);
}

export const { initIntervalCharts, setIntervalCharts, appendIntervalChart } =
  intervalChartsSlice.actions;
export default intervalChartsSlice.reducer;
