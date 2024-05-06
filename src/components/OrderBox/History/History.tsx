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
  weekly_win: number;
  weekly_lose: number;
  weekly_pnl: number;
  weekly_winrate: number;
};

interface HistoryProps {
  mode: string;
}

export const History = (props: HistoryProps) => {
  const historyRef = useRef<HTMLDivElement>(null);
  const [scores, setScores] = useState<ScoreHistory[]>([]);
  const [summary, setSummary] = useState<Summary>({
    total_win: 0,
    total_lose: 0,
    total_pnl: 0,
    weekly_win: 0,
    weekly_lose: 0,
    weekly_pnl: 0,
    weekly_winrate: 0,
  });

  const userInfo = useAppSelector((state) => state.userInfo);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lockReq, setLockReq] = useState<boolean>(false);

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
      if (lockReq) {
        return;
      }
      setIsLoading(true);
      const res = await axiosClient.get(
        `/auth/myscore?mode=${props.mode}&page=${page}`
      );
      if (res.data.length === 0) {
        // TODO: remove event listener
        setLockReq(true);
        setIsLoading(false);
        return;
      }
      setScores((prev) => [...prev, ...res.data]);
      setIsLoading(false);
    }
    GetHistory();
  }, [page]);

  useEffect(() => {
    async function GetHistorySummary() {
      try {
        const res = await axiosClient.get(`/basic/score/${userInfo.nickname}`);
        setSummary(res.data);
      } catch (err) {
        console.error(err);
      }
    }

    GetHistorySummary();

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
          <div>{`${summary.total_win + summary.total_lose}전 ${
            summary.total_win
          }승 ${summary.total_lose}패`}</div>
        </div>
        <div className="history_row_box">
          <div>{`이번 주 승률 (${summary.weekly_winrate})`}</div>
          <div>{`${summary.weekly_win + summary.weekly_lose}전 ${
            summary.weekly_win
          }승 ${summary.weekly_lose}패`}</div>
        </div>
        <div className="history_row_box">
          <div>전체 수익금</div>
          <div>{`${(
            Math.floor(100000 * summary.total_pnl) / 100000
          ).toLocaleString("en-US", { maximumFractionDigits: 0 })} USDP`}</div>
        </div>
        <div className="history_row_box">
          <div>이번 주 수익금</div>
          <div>{`${(
            Math.floor(100000 * summary.weekly_pnl) / 100000
          ).toLocaleString("en-US", { maximumFractionDigits: 0 })} USDP`}</div>
        </div>
      </div>
      {scores.map((score, index) => {
        return (
          <div className="history_score" key={index}>
            <div className="history_row_box" style={{ fontSize: "10px" }}>
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
            <div className={`history_row_box history_score_title_wrapper`}>
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
            <div className={`history_row_box history_pnl_roe`}>
              <div style={{ fontSize: "10px" }}>수익금</div>
              <div className="history_score_pnl">
                <span style={{ color: "#191919" }}>{`${FormatPosNeg(
                  Math.round(score.pnl)
                )}`}</span>{" "}
                USDP
              </div>
            </div>
            <div
              className={`history_row_box history_pnl_roe`}
              style={{ paddingTop: "5px", paddingBottom: "17px" }}
            >
              <div style={{ fontSize: "10px" }}>수익률</div>
              <div
                className={`history_score_roe ${
                  score.roe > 0 ? "roe_pos" : "roe_neg"
                }`}
              >{`${FormatPosNeg(Math.round(score.roe))}%`}</div>
            </div>
          </div>
        );
      })}
      {isLoading && <div style={{ paddingBottom: "10px" }}>Loading...</div>}
    </div>
  );
};
