import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { OneChart } from "../types/types";

const defaultChart: OneChart = {
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
};

const initialState = {
  oneDay: defaultChart,
  fourHours: defaultChart,
  oneHour: defaultChart,
  fifteenMinutes: defaultChart,
};

const intervalChartsSlice = createSlice({
  name: "intervalCharts",
  initialState,
  reducers: {
    setChart_1D: (state, action: PayloadAction<OneChart>) => {
      state.oneDay.pdata = action.payload.pdata;
      state.oneDay.vdata = action.payload.vdata;
    },
    setChart_4H: (state, action: PayloadAction<OneChart>) => {
      state.fourHours.pdata = action.payload.pdata;
      state.fourHours.vdata = action.payload.vdata;
    },
    setChart_1H: (state, action: PayloadAction<OneChart>) => {
      state.oneHour.pdata = action.payload.pdata;
      state.oneHour.vdata = action.payload.vdata;
    },
    setChart_15M: (state, action: PayloadAction<OneChart>) => {
      state.fifteenMinutes.pdata = action.payload.pdata;
      state.fifteenMinutes.vdata = action.payload.vdata;
    },
  },
});

export const { setChart_1D, setChart_4H, setChart_1H, setChart_15M } =
  intervalChartsSlice.actions;
export default intervalChartsSlice.reducer;
