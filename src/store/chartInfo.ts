import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ChartInfo } from "../types/types";

const defaultInfo: ChartInfo = {
  name: "",
  btcratio: 0,
  entrytime: "",
  entry_price: 0,
  identifier: "",
  onechart: {
    pdatas: [
      {
        close: 0,
        high: 0,
        low: 0,
        open: 0,
        time: "",
      },
    ],
    vdatas: [
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
  },
});

export const { setChartInfo } = chartInfoSlice.actions;
export default chartInfoSlice.reducer;
