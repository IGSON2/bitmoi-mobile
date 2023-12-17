export enum PageId {
  Home,
  Invest,
  Rank,
  MyPage,
}

export type PageInfo = {
  pageId: PageId;
  href: string;
};
