import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CurrentChart, OneChart, PData, VData } from "../types/types";
import { oneH } from "../types/const";
import { GetIntervalStep } from "../utils/IntervalUtil";
import { Time } from "lightweight-charts";

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
    setCurrentChartAppend: (state, action: PayloadAction<OneChart>) => {
      const currentLatestPdata =
        state.oneChart.pdata[state.oneChart.pdata.length - 1];
      const currentLatestTime = currentLatestPdata.time;

      let nextTime = (Number(currentLatestTime) +
        GetIntervalStep(state.interval)) as Time;

      let tempPdata: PData = {
        close: action.payload.pdata[0].close,
        high: 0,
        low: 100000,
        open: action.payload.pdata[0].open,
        time: currentLatestTime,
      };

      let tempVdata: VData = {
        value: 0,
        time: currentLatestTime,
        color: "rgba(239,83,80,0.5)",
      };

      const reqLatestPdata = action.payload.pdata[0];

      // 캔들을 추가해야 하는 경우
      if (reqLatestPdata.time >= nextTime) {
        tempPdata.time = nextTime;
        tempVdata.time = nextTime;
      } else if (
        // 마지막 캔들에 값을 더해야 하는 경우
        currentLatestTime <= reqLatestPdata.time &&
        reqLatestPdata.time < nextTime
      ) {
        tempPdata.high = currentLatestPdata.high;
        tempPdata.low = currentLatestPdata.low;
        tempPdata.open = currentLatestPdata.open;

        tempVdata.value =
          state.oneChart.vdata[state.oneChart.vdata.length - 1].value;
      } else {
        console.log("invalid req latest time.");
      }

      const reqPdata = action.payload.pdata[0];
      if (reqPdata.high > tempPdata.high) {
        tempPdata.high = reqPdata.high;
      }
      if (reqPdata.low < tempPdata.low) {
        tempPdata.low = reqPdata.low;
      }
      tempPdata.close = reqPdata.close;

      tempVdata.value += action.payload.vdata[0].value;

      if (tempPdata.open < tempPdata.close) {
        tempVdata.color = "rgba(38,166,154,0.5)";
      }

      if (tempPdata.time === currentLatestTime) {
        state.oneChart.pdata[state.oneChart.pdata.length - 1] = tempPdata;
        state.oneChart.vdata[state.oneChart.vdata.length - 1] = tempVdata;
      } else {
        state.oneChart.pdata.push(tempPdata);
        state.oneChart.vdata.push(tempVdata);
      }
    },
  },
});

export const { setCurrentChart, setCurrentChartAppend } =
  currentChartSlice.actions;
export default currentChartSlice.reducer;
