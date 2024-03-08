import { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import { PageID } from "../types/types";
import "./Rank.css";
import axiosClient from "../utils/axiosClient";

type RankInfo = {
  nickname: string;
  sum: number;
};

type period = {
  start: string;
  end: string;
};

type Category = "pnl" | "roe";

export const Rank = () => {
  const [rankInfo, setRankInfo] = useState<RankInfo[]>([]);
  const [period, setPeriod] = useState<period | null>(null);
  const [category, setCategory] = useState<Category>("pnl");
  useEffect(() => {
    const today = new Date();
    const day = today.getDay();
    const start = new Date(today.setDate(today.getDate() - day + 1));
    const end = new Date(today.setDate(start.getDate() + 6));

    setPeriod({ start: convertDate(start), end: convertDate(end) });
  }, []);

  useEffect(() => {
    async function getRanks() {
      if (period && period.start && period.end) {
        const res = await axiosClient.get(
          `/rank?mode=practice&category=${category}&start=${period.start}&end=${period.end}`
        );
        setRankInfo(res.data);
      }
    }
    getRanks();
  }, [period, category]);

  return (
    <div className="rank">
      <h1>랭킹</h1>
      <div className="rank_body">
        <div className="rank_category">
          <div
            className={category === "roe" ? "rank_category_selected" : ""}
            onClick={() => {
              setCategory("roe");
            }}
          >
            수익률
          </div>
          <div
            className={category === "pnl" ? "rank_category_selected" : ""}
            onClick={() => {
              setCategory("pnl");
            }}
          >
            수익금
          </div>
        </div>
        <div className="rank_list_wrapper">
          <div className="rank_list_header">
            <div className="rank_column_1">순위</div>
            <div className="rank_column_2">닉네임</div>
            <div className="rank_column_3">
              {category === "roe" ? "%" : "USDP"}
            </div>
          </div>
          <div className="rank_period">
            집계 기간{" : "}
            {period ? `${period.start.slice(3)} ~ ${period.end.slice(3)}` : ""}
          </div>
          {rankInfo.length > 0 ? (
            rankInfo.map((info, index) => {
              return (
                <div className="rank_list" key={index}>
                  <div className="rank_column_1">#{index + 1}</div>
                  <div className="rank_column_2">{info.nickname}</div>
                  <div className="rank_column_3">
                    {info.sum.toLocaleString("ko-KR", {
                      maximumFractionDigits: 0,
                    })}
                    {category === "roe" ? "%" : ""}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rank_no_data">
              <img src="/images/rank_no_data.png" alt="no-data" />
              <p>
                현재 집계된 랭킹이 없습니다.
                <br />
                연습모드에 참여하면 랭킹 순위에 반영됩니다.
              </p>
            </div>
          )}
        </div>
      </div>
      <Pagination pageID={PageID.Rank} /> {/* 객체의 전개 연산자 */}
    </div>
  );
};

function convertDate(date: Date): string {
  return (
    date.getFullYear().toString().slice(2, 4) +
    "-" +
    (date.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    date.getDate().toString().padStart(2, "0")
  );
}
