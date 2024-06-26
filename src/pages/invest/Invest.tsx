import Pagination from "../../components/Pagination";
import { PageID } from "../../types/types";
import "./Invest.css";

export const Invest = () => {
  const goPractice = async () => {
    window.location.href = "/invest/practice";
  };

  const goCompetition = async () => {
    window.location.href = "/invest/competition";
  };

  return (
    <div className="invest">
      <h1>모의투자</h1>
      <div className="modes">
        <div className="mode" onClick={goPractice}>
          연습 모드
        </div>
        <div className="mode" onClick={goCompetition}>
          경쟁 모드
        </div>
      </div>
      <Pagination pageID={PageID.Invest} /> {/* 객체의 전개 연산자 */}
    </div>
  );
};
