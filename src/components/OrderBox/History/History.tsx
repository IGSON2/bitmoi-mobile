import { useEffect, useRef, useState } from "react";
import "./History.css";
import axiosClient from "../../../utils/axiosClient";
import { ScoreHistory } from "../../../types/types";
import { Timeformatter } from "../../../utils/Timestamp";
import { useAppSelector } from "../../../hooks/hooks";
import { FormatPosNeg } from "../../../utils/PriceStyler";

type Summary = {
  total: number;
  total_win: number;
  total_lose: number;
  total_pnl: number;
  month: number;
  month_win: number;
  month_lose: number;
  month_pnl: number;
};

export const History = () => {
  const historyRef = useRef<HTMLDivElement>(null);
  const [scores, setScores] = useState<ScoreHistory[]>([]);
  const [summary, setSummary] = useState<Summary>({
    total: 0,
    total_win: 0,
    total_lose: 0,
    total_pnl: 0,
    month: 0,
    month_win: 0,
    month_lose: 0,
    month_pnl: 0,
  });

  const mode = useAppSelector((state) => state.order.mode);
  const [page, setPage] = useState<number>(1);

  const handleScroll = () => {
    const container = historyRef.current;

    if (container) {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight - 0.5) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  };

  useEffect(() => {
    async function GetHistory() {
      const res = await axiosClient.get(`/myscore?mode=${mode}&page=${page}`);
      if (res.data.length === 0) {
        // TODO: remove event listener
        return;
      }
      setScores((prev) => [...prev, ...res.data]);
      const calc_summary = calcSummary(res.data);
      setSummary(
        (prev) =>
          ({
            total: prev.total + calc_summary.total,
            total_win: prev.total_win + calc_summary.total_win,
            total_lose: prev.total_lose + calc_summary.total_lose,
            total_pnl: prev.total_pnl + calc_summary.total_pnl,
            month: prev.month + calc_summary.month,
            month_win: prev.month_win + calc_summary.month_win,
            month_lose: prev.month_lose + calc_summary.month_lose,
            month_pnl: prev.month_pnl + calc_summary.month_pnl,
          } as Summary)
      );
    }
    GetHistory();
  }, [page]);

  useEffect(() => {
    const container = historyRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div className="history" ref={historyRef}>
      <div className="history_summary">
        <div className="history_row_box history_summary_title">
          <div>전체 승률</div>
          <div>{`${summary.total}전 ${summary.total_win}승 ${summary.total_lose}패`}</div>
        </div>
        <div className="history_row_box">
          <div>{`이번 달 승률 (${
            summary.month > 0
              ? (100 * Math.floor((100 * summary.month_win) / summary.month)) /
                100
              : 0
          })`}</div>
          <div>{`${summary.month}전 ${summary.month_win}승 ${summary.month_lose}패`}</div>
        </div>
        <div className="history_row_box">
          <div>전체 수익금</div>
          <div>{`${(
            Math.floor(100000 * summary.total_pnl) / 100000
          ).toLocaleString("en-US", { maximumFractionDigits: 0 })} USDT`}</div>
        </div>
        <div className="history_row_box">
          <div>이번 달 수익금</div>
          <div>{`${(
            Math.floor(100000 * summary.month_pnl) / 100000
          ).toLocaleString("en-US", { maximumFractionDigits: 0 })} USDT`}</div>
        </div>
      </div>
      {scores.map((score, index) => {
        return (
          <div className="history_score" key={index}>
            <div className="history_row_box">
              <div className="history_score_position_lev">
                <div
                  className={`history_score_position ${
                    score.position === "LONG"
                      ? "position_long"
                      : "position_short"
                  }`}
                >
                  {score.position}
                </div>
                <div className="history_score_leverage">X{score.leverage}</div>
              </div>
              <div className="history_score_created_at">
                {Timeformatter(score.created_at, false)}
              </div>
            </div>
            <div className="history_row_box">
              <div className="history_score_title">{score.pairname}</div>
              <div className="history_score_prices">
                {/* {score.outtime === 0 ? (
                  score.settled_at.Valid ? (
                    <div
                      className="history_score_adjust"
                      style={{
                        color: "#1409A0",
                      }}
                    >
                      정산 완료
                    </div>
                  ) : (
                    <div
                      className="history_score_adjust"
                      style={{ color: "#ff0000" }}
                    >
                      정산 예정
                    </div>
                  )
                ) : null} */}
                <div className="history_score_entry_price">
                  {score.entryprice}
                </div>
                <div>/</div>
                <div
                  className={`history_score_end_price ${
                    score.roe > 0 ? "roe_pos" : "roe_neg"
                  }`}
                >
                  {score.endprice}
                </div>
              </div>
            </div>
            <div className="history_row_box" style={{ paddingTop: "17px" }}>
              <div>수익금</div>
              <div className="history_score_pnl">
                <span style={{ color: "#191919" }}>{`${FormatPosNeg(
                  Math.round(score.pnl)
                )}`}</span>{" "}
                USDT
              </div>
            </div>
            <div className="history_row_box" style={{ paddingBottom: "21px" }}>
              <div>수익률</div>
              <div
                className={`history_score_roe ${
                  score.roe > 0 ? "roe_pos" : "roe_neg"
                }`}
              >{`${FormatPosNeg(Math.round(score.roe))}%`}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

function calcSummary(scores: ScoreHistory[]) {
  let summary: Summary = {
    total: 0,
    total_win: 0,
    total_lose: 0,
    total_pnl: 0,
    month: 0,
    month_win: 0,
    month_lose: 0,
    month_pnl: 0,
  };

  if (scores.length === 0) {
    return summary;
  }

  scores.forEach((score) => {
    summary.total_pnl += score.pnl;
    score.pnl > 0 ? (summary.total_win += 1) : (summary.total_lose += 1);

    const month = new Date(score.created_at).getMonth();
    if (month === new Date().getMonth()) {
      summary.month_pnl += score.pnl;
      score.pnl > 0 ? (summary.month_win += 1) : (summary.month_lose += 1);
    }
    summary.total = summary.total_win + summary.total_lose;
    summary.month = summary.month_win + summary.month_lose;
  });
  return summary;
}
