export enum PageId {
  Home,
  Invest,
  Rank,
  MyPage,
}

export enum OrderBox_Menu {
  None,
  Long,
  Short,
  History,
}

export type PageInfo = {
  pageId: PageId;
};

export type PData = {
  close: number;
  high: number;
  low: number;
  open: number;
  time: string;
};

type VData = {
  value: number;
  time: string;
  color: string;
};

export type OneChart = {
  pdata: PData[];
  vdata: VData[];
};

export type CurrentChart = {
  interval: IntervalType;
  oneChart: OneChart;
};

export type Order = {
  mode: string;
  user_id: string;
  name: string;
  stage: number;
  is_long: boolean;
  entry_price: number;
  quantity: number;
  profit_price: number;
  loss_price: number;
  leverage: number;
  balance: number;
  identifier: string;
  score_id: string;
  reqinterval: string;
  min_timestamp: number;
  max_timestamp: number;
};

export type Score = {
  stage: number;
  pairname: string;
  position: string;
  leverage: number;
  entryprice: number;
  endprice: number;
  out_time: number;
  roe: number;
  pnl: number;
  commission: number;
  is_liquidated: boolean;
  created_at: string;
};

export type StageState = {
  name: string;
  btcratio: number;
  entrytime: number;
  titleArray: string[];
};

export interface IntervalProps {
  intv: IntervalType;
}

export type Position = {
  isLong: boolean;
};

export type IntervalType = "5m" | "15m" | "1h" | "4h" | "1d";

export type UserInfo = {
  user_id: string;
  nickname: string;
  email: string;
  photo_url: string;
  metamask_address: string;
  password_changed_at: string;
  created_at: string;
};
