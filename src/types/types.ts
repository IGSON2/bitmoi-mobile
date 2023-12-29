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

export type Score = {
  stage: number;
  name: string;
  leverage: number;
  entry_price: number;
  profit_price: number;
  loss_price: number;
  end_price: number;
  out_time: number;
  roe: number;
  pnl: number;
  commission: number;
  is_liquidated: boolean;
};

export type ChartInfo = {
  name: string;
  btcratio: number;
  entrytime: string;
  entry_price: number;
  identifier: string;
  onechart: OneChart;
};

export interface IntervalProps {
  intv: IntervalType;
}

export type Position = {
  isLong: boolean;
};

export type PracState = {
  balance: number;
  entryPrice: number;
};

export type IntervalType = "5m" | "15m" | "1h" | "4h" | "1d";
