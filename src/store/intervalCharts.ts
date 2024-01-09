import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ChartInfo } from "../types/types";

const defaultChartInfo: ChartInfo = {
  name: "",
  btcratio: 0,
  entrytime: "",
  entry_price: 0,
  identifier: "",
  onechart: {
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

const initialState = {
  oneDay: defaultChartInfo,
  fourHours: defaultChartInfo,
  oneHour: defaultChartInfo,
  fifteenMinutes: defaultChartInfo,
};

const intervalChartsSlice = createSlice({
  name: "chartInfo",
  initialState,
  reducers: {
    setOneDayChartInfo: (state, action: PayloadAction<ChartInfo>) => {
      state.oneDay = action.payload;
    },
    setFourHoursChartInfo: (state, action: PayloadAction<ChartInfo>) => {
      state.fourHours = action.payload;
    },
    setOneHourChartInfo: (state, action: PayloadAction<ChartInfo>) => {
      state.oneHour = action.payload;
    },
    setFifMinutesChartInfo: (state, action: PayloadAction<ChartInfo>) => {
      state.fifteenMinutes = action.payload;
    },
  },
});

export const {
  setOneDayChartInfo,
  setFourHoursChartInfo,
  setOneHourChartInfo,
  setFifMinutesChartInfo,
} = intervalChartsSlice.actions;
export default intervalChartsSlice.reducer;
