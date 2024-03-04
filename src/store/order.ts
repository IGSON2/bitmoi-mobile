import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Order } from "../types/types";

const initialState: Order = {
  mode: "",
  user_id: "",
  name: "",
  is_long: true,
  entry_price: 0,
  quantity: 0,
  profit_price: 0,
  loss_price: 0,
  leverage: 1,
  identifier: "",
  score_id: "",
  curinterval: "",
  reqinterval: "",
  cur_timestamp: 0,
  min_timestamp: 0,
  max_timestamp: 0,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    initOrder: (state) => {
      state.user_id = "";
      state.name = "";
      state.is_long = true;
      state.entry_price = 0;
      state.quantity = 0;
      state.profit_price = 0;
      state.loss_price = 0;
      state.leverage = 1;
      state.identifier = "";
      state.curinterval = "";
      state.reqinterval = "";
      state.cur_timestamp = 0;
      state.min_timestamp = 0;
      state.max_timestamp = 0;
    },
    setOrderMode: (state, action: PayloadAction<string>) => {
      state.mode = action.payload;
    },
    setOrderUserId: (state, action: PayloadAction<string>) => {
      state.user_id = action.payload;
    },
    setOrderName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setOrderIsLong: (state, action: PayloadAction<boolean>) => {
      state.is_long = action.payload;
    },
    setOrderEntryPrice: (state, action: PayloadAction<number>) => {
      state.entry_price = action.payload;
    },
    setOrderQuantity: (state, action: PayloadAction<number>) => {
      state.quantity = action.payload;
    },
    setOrderProfitPrice: (state, action: PayloadAction<number>) => {
      state.profit_price = action.payload;
    },
    setOrderLossPrice: (state, action: PayloadAction<number>) => {
      state.loss_price = action.payload;
    },
    setOrderLeverage: (state, action: PayloadAction<number>) => {
      state.leverage = action.payload;
    },
    setOrderIdentifier: (state, action: PayloadAction<string>) => {
      state.identifier = action.payload;
    },
    setOrderScoreId: (state, action: PayloadAction<string>) => {
      state.score_id = action.payload;
    },
    setOrderCurInterval: (state, action: PayloadAction<string>) => {
      state.curinterval = action.payload;
    },
    setOrderReqInterval: (state, action: PayloadAction<string>) => {
      state.reqinterval = action.payload;
    },
    setOrderCurTimestamp: (state, action: PayloadAction<number>) => {
      state.cur_timestamp = action.payload;
    },
    setOrderMinTimestamp: (state, action: PayloadAction<number>) => {
      state.min_timestamp = action.payload;
    },
    setOrderMaxTimestamp: (state, action: PayloadAction<number>) => {
      state.max_timestamp = action.payload;
    },
  },
});

export const {
  initOrder,
  setOrderMode,
  setOrderUserId,
  setOrderName,
  setOrderIsLong,
  setOrderEntryPrice,
  setOrderQuantity,
  setOrderProfitPrice,
  setOrderLossPrice,
  setOrderLeverage,
  setOrderIdentifier,
  setOrderScoreId,
  setOrderCurInterval,
  setOrderReqInterval,
  setOrderCurTimestamp,
  setOrderMinTimestamp,
  setOrderMaxTimestamp,
} = orderSlice.actions;
export default orderSlice.reducer;
