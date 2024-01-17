import Pagination from "../components/Pagination";
import { PageId, PageInfo } from "../types/types";
import "./Rank.css";

export const Rank = () => {
  const pageInfo: PageInfo = {
    pageId: PageId.Rank,
  };
  return (
    <div className="rank">
      <h1>Rank</h1>
      <Pagination {...pageInfo} /> {/* 객체의 전개 연산자 */}
    </div>
  );
};
