import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ChartInfo, OneChart } from "../types/types";

const defaultInfo: ChartInfo = {
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

const initialState: ChartInfo = defaultInfo;

const chartInfoSlice = createSlice({
  name: "chartInfo",
  initialState,
  reducers: {
    setChartInfo: (state, action: PayloadAction<ChartInfo>) => {
      state = action.payload;
    },
    appendOneChart: (state, action: PayloadAction<OneChart>) => {
      state.onechart.pdata = [...state.onechart.pdata, ...action.payload.pdata];
      state.onechart.vdata = [...state.onechart.vdata, ...action.payload.vdata];
    },
  },
});

export const { setChartInfo } = chartInfoSlice.actions;
export default chartInfoSlice.reducer;
