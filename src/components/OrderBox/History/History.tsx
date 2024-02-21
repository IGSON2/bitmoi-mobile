import { useEffect, useRef, useState } from "react";
import "./History.css";
import axiosClient from "../../../utils/axiosClient";
import { ScoreHistory } from "../../../types/types";
import { Timeformatter } from "../../../utils/Timestamp";
import { useAppSelector } from "../../../hooks/hooks";
import { FormatPosNeg } from "../../../utils/PriceStyler";

type Summary = {
  total_pnl: number;
  total_win: number;
  total_lose: number;
  monthly_win: number;
  monthly_lose: number;
  monthly_pnl: number;
  monthly_winrate: number;
};

export const History = () => {
  const historyRef = useRef<HTMLDivElement>(null);
  const [scores, setScores] = useState<ScoreHistory[]>([]);
  const [summary, setSummary] = useState<Summary>({
    total_win: 0,
    total_lose: 0,
    total_pnl: 0,
    monthly_win: 0,
    monthly_lose: 0,
    monthly_pnl: 0,
    monthly_winrate: 0,
  });

  const mode = useAppSelector((state) => state.order.mode);
  const userInfo = useAppSelector((state) => state.userInfo);
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
    }
    GetHistory();
  }, [page]);

  useEffect(() => {
    async function GetHistorySummary() {
      try {
        const res = await axiosClient.get(`/score/${userInfo.nickname}`);
        setSummary(res.data);
      } catch (err) {
        console.error(err);
      }
    }

    const container = historyRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    GetHistorySummary();

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
          <div>{`${summary.total_win + summary.total_lose}전 ${
            summary.total_win
          }승 ${summary.total_lose}패`}</div>
        </div>
        <div className="history_row_box">
          <div>{`이번 달 승률 (${summary.monthly_winrate})`}</div>
          <div>{`${summary.monthly_win + summary.monthly_lose}전 ${
            summary.monthly_win
          }승 ${summary.monthly_lose}패`}</div>
        </div>
        <div className="history_row_box">
          <div>전체 수익금</div>
          <div>{`${(
            Math.floor(100000 * summary.total_pnl) / 100000
          ).toLocaleString("en-US", { maximumFractionDigits: 0 })} USDP`}</div>
        </div>
        <div className="history_row_box">
          <div>이번 달 수익금</div>
          <div>{`${(
            Math.floor(100000 * summary.monthly_pnl) / 100000
          ).toLocaleString("en-US", { maximumFractionDigits: 0 })} USDP`}</div>
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
                USDP
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
