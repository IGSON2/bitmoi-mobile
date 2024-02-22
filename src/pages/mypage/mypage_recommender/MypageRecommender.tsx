import { useAppSelector } from "../../../hooks/hooks";
import { FormatPosNeg } from "../../../utils/PriceStyler";
import { MypageHeader } from "../mypage_header/MypageHeader";
import "./MypageRecommender.css";

const cur_reward = 10;

type HistoryInfo = {
  date: string;
  earned: number;
};

const tempHistory: HistoryInfo[] = [
  { date: "2021-10-01", earned: 10 },
  { date: "2021-10-02", earned: 10 },
  { date: "2021-10-03", earned: 10 },
  { date: "2021-10-04", earned: 10 },
  { date: "2021-10-05", earned: 10 },
  { date: "2021-10-06", earned: 10 },
  { date: "2021-10-07", earned: 10 },
  { date: "2021-10-08", earned: 10 },
  { date: "2021-10-09", earned: 10 },
  { date: "2021-10-10", earned: 10 },
];

export function MypageRecommender() {
  const userInfo = useAppSelector((state) => state.userInfo);
  const referrals = 7;
  return (
    <div className="mypage_recommender">
      <MypageHeader title="추천인" />
      <div className="mypage_recommender_header">
        <img src="/images/bitmoi.png" alt="bitmoi" />
        <div className="mypage_recommender_header_reward_wrapper">
          <div className="mypage_recommender_header_reward_tri tri_left"></div>
          <div className="mypage_recommender_header_reward_tri tri_right"></div>
          <div className="mypage_recommender_header_reward_body">{`1 REFERRAL = ${cur_reward} BITMOI`}</div>
        </div>
        <div className="mypage_recommender_header_referrals">{`You have ${referrals} referrals`}</div>
      </div>
      <div className="mypage_recommender_code_wrapper">
        <div className="mypage_recommender_code_title">추천코드</div>
        <div className="mypage_recommender_code_value">
          {userInfo.recommender_code}
        </div>
        <img src="/images/share.png" alt="share" />
      </div>
      <div className="mypage_recommender_history_wrapper">
        <div className="mypage_recommender_history_header">
          <div>Date</div>
          <div>Earned Token</div>
        </div>
        {tempHistory.map((his) => {
          return (
            <div className="mypage_recommender_history_row">
              <div className="mypage_recommender_history_row_date">
                {his.date}
              </div>
              <div className="mypage_recommender_history_row_earned">
                {FormatPosNeg(his.earned)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
