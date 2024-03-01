import Pagination from "../components/Pagination";
import { PageID } from "../types/types";
import "./Rank.css";

export const Rank = () => {
  return (
    <div className="rank">
      <h1>랭킹</h1>
      <Pagination pageID={PageID.Rank} /> {/* 객체의 전개 연산자 */}
    </div>
  );
};
