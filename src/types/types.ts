export enum PageId {
  Home,
  Invest,
  Rank,
  MyPage,
}

export type PageInfo = {
  pageId: PageId;
};

type PData = {
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

export type Candle = {
  pdata: PData;
  vdata: VData;
};

export type Candles = Candle[];

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

export type ChartProps = {
  pdatas: PData[];
  vdats: VData[];
  height: number;
};
