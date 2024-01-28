import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { setPositionClosed } from "../../../store/positionClosed";
import { setSubmit } from "../../../store/submit";
import "./ResultModal.css";
import VerticalLine from "../../lines/VerticalLine";
import { ConvertSeconds } from "../../../utils/Timestamp";
import { FormatPosNeg } from "../../../utils/PriceStyler";
import { GetMinMaxRoe } from "../../../types/stageState";
import { setAddRefreshCnt } from "../../../store/stageState";

type infoByRoe = {
  imageUrl: string;
  comment: string[];
};

function ResultModal() {
  const score = useAppSelector((state) => state.score);
  const state = useAppSelector((state) => state.stageState);
  const dispatch = useAppDispatch();

  const [ibr, setIbr] = useState<infoByRoe>({ imageUrl: "", comment: [] });

  function close() {
    dispatch(setSubmit(false));
    dispatch(setPositionClosed(false));
    dispatch(setAddRefreshCnt());
  }

  useEffect(() => {
    setIbr(getIbr(score.current_score.roe));
  }, [score]);

  return (
    <div className="result_modal">
      <div className="result_modal_blank"></div>
      <div className="result_modal_score">
        <img
          className={`result_modal_close`}
          onClick={close}
          src="/images/close.png"
          alt="close"
        />
        <div className="result_modal_center_wrapper">
          <img
            className={`result_modal_emoji`}
            src={ibr.imageUrl}
            alt="emoji"
          />
        </div>
        <div className={`result_modal_center_wrapper result_modal_title`}>
          포지션 결과
        </div>
        <div className="result_modal_main_wrapper">
          <div className="result_modal_main_info">
            <div className="result_modal_name">{score.current_score.name}</div>
            <div
              className="result_modal_position"
              style={
                score.current_score.is_long
                  ? { color: "#249C91", fontWeight: 700 }
                  : { color: "#E36F6F", fontWeight: 700 }
              }
            >
              <div>{score.current_score.is_long ? "LONG" : "SHORT"}</div>
              <VerticalLine />
              <div>{score.current_score.leverage}X</div>
            </div>
          </div>
          <div
            className="result_modal_profit_info"
            style={
              score.current_score.roe >= 0
                ? { color: "#249C91" }
                : { color: "#EF5350" }
            }
          >
            <div className="result_modal_roe">
              {FormatPosNeg(Math.round(100 * score.current_score.roe) / 100)}%
            </div>
            <div className="result_modal_pnl">
              {FormatPosNeg(Math.round(100 * score.current_score.pnl) / 100)}{" "}
              USDT
            </div>
          </div>
        </div>
        <div className="result_modal_detail">
          <div className="result_modal_between_wrapper">
            <div className="result_modal_detail_title">매수 체결</div>
            <div>즉시</div> {/* 예약 진입 활성화 시 변경예정 */}
          </div>
          <div className="result_modal_between_wrapper">
            <div className="result_modal_detail_title">포지션 종료</div>
            <div>{ConvertSeconds(state.elapsed_time)}</div>
            {/* <div>{ConvertSeconds(score.after_score.closed_time)}</div> */}
          </div>
          <div className="result_modal_between_wrapper">
            <div className="result_modal_detail_title">진입 후 최대 손익률</div>
            <div>{`${FormatPosNeg(
              Math.round(GetMinMaxRoe(state.roe_array).min_roe)
            )}% / ${FormatPosNeg(
              Math.round(GetMinMaxRoe(state.roe_array).max_roe)
            )}%`}</div>
          </div>
        </div>
        <div className="result_modal_comment">
          {ibr.comment.map((c) => {
            return <p>{c}</p>;
          })}
        </div>
      </div>
    </div>
  );
}

function getIbr(roe: number): infoByRoe {
  const info: infoByRoe = { imageUrl: "", comment: [] };
  if (roe >= 0) {
    if (roe <= 15) {
      return {
        imageUrl: "/images/profit-1.gif",
        comment: ["익절은 항상 옳다! 익항옳!"],
      };
    } else if (roe < 50) {
      return {
        imageUrl: "/images/profit-2.gif",
        comment: [
          "투자에 소질이 있네요?! 연습을 조금 더 하시면",
          "완벽해질 거에요. 방금 진입한 이유를 꼭 기억하세요!",
        ],
      };
    } else if (roe < 200) {
      return {
        imageUrl: "/images/profit-3.gif",
        comment: [
          "이대로만 가면 내 집 마련 성공!",
          "더욱 매매 복기가 필요한 시점!!!",
        ],
      };
    } else if (roe < 1000) {
      return {
        imageUrl: "/images/profit-4.gif",
        comment: ["미친 수익률...!", "혹시... 워뇨띠..!?"],
      };
    } else if (roe >= 1000) {
      return {
        imageUrl: "/images/profit-5.gif",
        comment: ["매수는 기술, 매도는 예술", "당신은... 마술"],
      };
    }
  } else {
    if (roe >= -15) {
      info.imageUrl = "/images/loss-1.gif";
      info.comment = [
        "실전 투자 전 연습이 더 필요해보여요!",
        "예상한 손절이라면 좋은 전략이에요.",
      ];
    } else if (roe > -50) {
      info.imageUrl = "/images/loss-2.gif";
      info.comment = [
        "손절에 대한 대응이 익절보다 중요해요.",
        "잃지 않도록 손절 대응이 필요해보여요!",
      ];
    } else if (roe > -80) {
      info.imageUrl = "/images/loss-3.gif";
      info.comment = ["당신의 손은 똥손입니까???", "절대 선물은 하지마세요..."];
    } else if (roe < -80) {
      info.imageUrl = "/images/loss-4.gif";
      info.comment = [
        "청산에 살으리랐다~ 얄라리 얄라셩",
        "투자는 포기하시는게....현물만 하세요...",
      ];
    }
  }
  return info;
}

export default ResultModal;
