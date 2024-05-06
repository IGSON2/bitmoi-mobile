import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "../../../hooks/hooks";
import { FormatPosNeg } from "../../../utils/PriceStyler";
import { MypageHeader } from "../mypage_header/MypageHeader";
import "./MypageRecommender.css";
import axiosClient from "../../../utils/axiosClient";
import { Timeformatter } from "../../../utils/Timestamp";

const cur_reward = 10;

type HistoryInfo = {
  id: number;
  to_user: string;
  amount: number;
  title: string;
  created_at: string;
};

export function MypageRecommender() {
  const rewardRef = useRef<HTMLDivElement>(null);
  const [histories, setHistories] = useState<HistoryInfo[]>([]);
  const [page, setPage] = useState<number>(1);

  const userInfo = useAppSelector((state) => state.userInfo);

  function shareLink() {
    const shareData = {
      title: "Bitmoi",
      text: "시뮬레이션 모의투자 비트모이에 초대합니다.",
      url: `https://m.bitmoi.co.kr/login/welcome?recommender=${userInfo.recommender_code}`, // login 링크 param을 welcome으로 던지면 이미 존재하는 계정도 welcome으로 갈거고, 추천인 입력을 다시 시도할 수 있음.
    };
    if (navigator.share && navigator.canShare(shareData)) {
      navigator.share(shareData);
    } else {
      alert("공유하기 기능을 지원하지 않는 브라우저입니다.");
    }
  }

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
      const res = await axiosClient.get(
        `/auth/user/wmoi-transactions?page=${page}`
      );
      const data = res.data;
      if (data.length === 0) {
        rewardRef.current?.removeEventListener("scroll", handleScroll);
        return;
      }
      setHistories((prev) => [...prev, ...data]);
    }
    getHistory();
  }, [page]);

  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    meta?.setAttribute("content", "#f6f6f6");

    const container = rewardRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      meta?.setAttribute("content", "#ffffff");
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div className="mypage_recommender">
      <MypageHeader title="추천인" backLink="mypage" />
      <div className="mypage_recommender_header">
        <img src="/images/bitmoi.png" alt="bitmoi" />
        <div className="mypage_recommender_header_reward_wrapper">
          <div className="mypage_recommender_header_reward_tri tri_left"></div>
          <div className="mypage_recommender_header_reward_tri tri_right"></div>
          <div className="mypage_recommender_header_reward_body">{`1 REFERRAL = ${cur_reward} BITMOI`}</div>
        </div>
        <div className="mypage_recommender_header_referrals">{`You have ${histories.length} referrals`}</div>
      </div>
      <div className="mypage_recommender_code_wrapper">
        <div className="mypage_recommender_code_title">추천코드</div>
        <div className="mypage_recommender_code_value">
          {userInfo.recommender_code}
        </div>
        <img src="/images/share.png" alt="share" onClick={shareLink} />
      </div>
      {histories.length > 0 ? (
        <div
          className="mypage_recommender_history_wrapper"
          ref={rewardRef}
          onScroll={handleScroll}
        >
          <div className="mypage_recommender_history_header">
            <div>Date</div>
            <div>Earned Token</div>
          </div>
          {histories.map((his, idx) => {
            return (
              <div className="mypage_recommender_history_row" key={idx}>
                <div className="mypage_recommender_history_row_date">
                  {Timeformatter(his.created_at, false)}
                </div>
                <div className="mypage_recommender_history_row_earned">
                  {FormatPosNeg(his.amount)}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
