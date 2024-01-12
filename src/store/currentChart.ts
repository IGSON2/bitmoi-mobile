import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { OneChart } from "../types/types";

const defaultInfo: OneChart = {
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

const initialState = defaultInfo;

const currentChartSlice = createSlice({
  name: "currentChart",
  initialState,
  reducers: {
    setCurrentChart: (state, action: PayloadAction<OneChart>) => {
      state = action.payload;
    },
    appendCurrentChart: (state, action: PayloadAction<OneChart>) => {
      state.pdata = [...state.pdata, ...action.payload.pdata];
      state.vdata = [...state.vdata, ...action.payload.vdata];
    },
  },
});

export const { setCurrentChart, appendCurrentChart } =
  currentChartSlice.actions;
export default currentChartSlice.reducer;
