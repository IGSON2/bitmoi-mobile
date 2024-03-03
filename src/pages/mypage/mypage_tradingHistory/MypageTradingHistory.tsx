import { useState } from "react";
import { History } from "../../../components/OrderBox/History/History";
import { MypageHeader } from "../mypage_header/MypageHeader";
import "./MypageTradingHistory.css";
import { useAppSelector } from "../../../hooks/hooks";

export function MypageTradingHistory() {
  const [mode, setMode] = useState("practice");
  const userinfo = useAppSelector((state) => state.userInfo);
  return (
    <div className="mypage_trading_history">
      <MypageHeader title="거래내역" backLink="mypage" />
      <div className="mypage_trading_history_header">
        <div
          className={
            mode === "practice" ? "mypage_trading_history_header_selected" : ""
          }
          onClick={() => {
            setMode("practice");
          }}
        >
          연습모드
        </div>
        <div
          className={
            mode === "competition"
              ? "mypage_trading_history_header_selected"
              : ""
          }
          onClick={() => {
            setMode("competition");
          }}
        >
          경쟁모드
        </div>
      </div>
      {mode === "practice" ? (
        <History mode={mode} />
      ) : (
        <div className="mypage_trading_history_competition">
          <img src="/images/bitmoi.png" alt="logo" />
          <p>
            경쟁모드 오픈시
            <br />
            확인 할 수 있습니다.
          </p>
        </div>
      )}
    </div>
  );
}
