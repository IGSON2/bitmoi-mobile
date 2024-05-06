import { useEffect, useRef, useState } from "react";
import { MypageHeader } from "../mypage_header/MypageHeader";
import "./MypageAccumulation.css";
import axiosClient from "../../../utils/axiosClient";
import { Timeformatter } from "../../../utils/Timestamp";
import { FormatPosNeg } from "../../../utils/PriceStyler";

type HistoryInfo = {
  id: number;
  to_user: string;
  amount: number;
  title: string;
  created_at: string;
};

export function MypageAccumulation() {
  const rewardRef = useRef<HTMLDivElement>(null);
  const [histories, setHistories] = useState<HistoryInfo[]>([]);
  const [page, setPage] = useState<number>(1);

  const handleScroll = () => {
    const container = rewardRef.current;

    if (container) {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;

      if (scrollTop + clientHeight === scrollHeight - 1) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  };

  useEffect(() => {
    async function getHistory() {
      const res = await axiosClient.get(`/auth/user/accumulation?page=${page}`);
      const data = res.data;
      if (data.length === 0) {
        rewardRef.current?.removeEventListener("scroll", handleScroll);
        return;
      }
      setHistories((prev) => [...prev, ...data]);
    }
    getHistory();
  }, [page]);
  return (
    <div className="mypage_accumulation">
      <MypageHeader title="적립내역" backLink="mypage" />
      <div className="mypage_accumulation_scroll_wrapper">
        {histories.map((history, idx) => {
          return (
            <div key={idx} className="mypage_accumulation_wrapper">
              <div className="mypage_accumulation_date">
                {Timeformatter(history.created_at, false)}
              </div>
              <div className="mypage_accumulation_title_wrapper">
                <div className="mypage_accumulation_title">{history.title}</div>
                <div className="mypage_accumulation_balance">
                  {FormatPosNeg(history.amount)} USDP
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
