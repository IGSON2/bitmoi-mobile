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

export type IntervalCharts = {
  oneDay: OneChart;
  fourHours: OneChart;
  oneHour: OneChart;
  fifteenMinutes: OneChart;
};

export type OrderInit = {
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

export type AfterScore = {
  closed_time: number;
  min_roe: number;
  max_roe: number;
};

export type CurrentScore = {
  name: string;
  is_long: boolean;
  entry_time: string;
  leverage: number;
  end_price: number;
  out_time: number;
  roe: number;
  pnl: number;
  commission: number;
  is_liquidated: boolean;
};

export type Score = {
  current_score: CurrentScore;
  after_score: AfterScore;
};

export type ScoreHistory = {
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
  elapsed_time: number;
};

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
  prac_balance: number;
  comp_balance: number;
  recommender_code: string;
  created_at: string;
};
