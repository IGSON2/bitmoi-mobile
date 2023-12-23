import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Candle, Candles } from "../types/types";

const defaultCandle: Candle = {
  pdata: {
    close: 0,
    high: 0,
    low: 0,
    open: 0,
    time: "",
  },
  vdata: {
    value: 0,
    time: "",
    color: "",
  },
};

const initialState: Candles = [defaultCandle];

const candlesSlice = createSlice({
  name: "candles",
  initialState,
  reducers: {
    setCandles: (state, action: PayloadAction<Candles>) => {
      state = action.payload;
    },
  },
});

export const { setCandles: setIsEng } = candlesSlice.actions;
export default candlesSlice.reducer;
