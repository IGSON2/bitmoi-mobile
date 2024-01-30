import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CurrentChart, OneChart, PData, VData } from "../types/types";
import { oneH } from "../types/const";
import { GetIntervalStep } from "../utils/IntervalUtil";
import { UTCTimestamp } from "lightweight-charts";

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
    setAppendTempCandle: (state, action: PayloadAction<OneChart>) => {
      const nextTime = (Number(
        // TODO: 무조건 다음 캔들이 추가됨, 다음 캔들이 추가되지 않을 경우를 고려해야함
        state.oneChart.pdata[state.oneChart.pdata.length - 1].time
      ) + GetIntervalStep(state.interval)) as UTCTimestamp;

      let tempPdata: PData = {
        close: action.payload.pdata[action.payload.pdata.length - 1].close,
        high: 0,
        low: 100000,
        open: action.payload.pdata[0].open,
        time: nextTime,
      };

      let tempVdata: VData = {
        value: 0,
        time: nextTime,
        color: "rgba(239,83,80,0.5)",
      };

      for (let i = 0; i < action.payload.pdata.length; i++) {
        const reqPdata = action.payload.pdata[i];
        if (reqPdata.high > tempPdata.high) {
          tempPdata.high = reqPdata.high;
        }
        if (reqPdata.low < tempPdata.low) {
          tempPdata.low = reqPdata.low;
        }

        tempVdata.value += action.payload.vdata[i].value;
      }

      if (tempPdata.open < tempPdata.close) {
        tempVdata.color = "rgba(38,166,154,0.5)";
      }

      state.oneChart.pdata.push(tempPdata);
      state.oneChart.vdata.push(tempVdata);
    },
  },
});

export const { setCurrentChart, setAppendTempCandle } =
  currentChartSlice.actions;
export default currentChartSlice.reducer;
