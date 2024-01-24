import { useEffect, useRef, useState } from "react";
import "./History.css";
import axiosClient from "../../../utils/axiosClient";
import { ScoreHistory } from "../../../types/types";
import { Timeformatter } from "../../../utils/Timestamp";
import { useAppSelector } from "../../../hooks/hooks";

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

      if (scrollTop + clientHeight === scrollHeight) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  };

  useEffect(() => {
    async function GetHistory() {
      const res = await axiosClient.get(`/myscore?mode=${mode}&page=${page}`);
      if (res.data.length === 0) {
        if (historyRef.current) {
          historyRef.current?.removeEventListener("scroll", handleScroll); //TODO: 적용안됨
        }
        return;
      }
      setScores((prev) => [...prev, ...res.data]);
      const summary = calcSummary(res.data);
      setSummary(summary);
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
            (100 * Math.floor((100 * summary.month_win) / summary.month)) / 100
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
                <span style={{ color: "#191919" }}>{`${
                  score.pnl > 0 ? "+" : ""
                }${score.pnl.toLocaleString("en-US", {
                  maximumFractionDigits: 0,
                })}`}</span>{" "}
                USDT
              </div>
            </div>
            <div className="history_row_box" style={{ paddingBottom: "21px" }}>
              <div>수익률</div>
              <div
                className={`history_score_roe ${
                  score.roe > 0 ? "roe_pos" : "roe_neg"
                }`}
              >{`${score.pnl > 0 ? "+" : "-"}${Math.round(score.roe)}%`}</div>
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
