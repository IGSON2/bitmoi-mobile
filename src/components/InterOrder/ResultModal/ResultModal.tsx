import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { setPositionClosed } from "../../../store/positionClosed";
import { setSubmit } from "../../../store/submit";
import "./ResultModal.css";
import VerticalLine from "../../lines/VerticalLine";
import { ConvertSeconds } from "../../../utils/Timestamp";

type infoByRoe = {
  imageUrl: string;
  comment: string;
};

function ResultModal() {
  const score = useAppSelector((state) => state.score);
  const state = useAppSelector((state) => state.stageState);
  const dispatch = useAppDispatch();

  const [ibr, setIbr] = useState<infoByRoe>({ imageUrl: "", comment: "" });

  function close() {
    dispatch(setSubmit(false));
    dispatch(setPositionClosed(false));
  }

  useEffect(() => {
    setIbr(getIbr(score.current_score.roe));
  }, [score]);

  return (
    <div className="result_modal">
      <div className="result_modal_blank"></div>
      <div className="result_modal_score">
        <div className="result_modal_current">
          <img className="result_modal_emoji" src={ibr.imageUrl} alt="emoji" />
          <div className="result_modal_title">포지션결과</div>
          <img onClick={close} src="/images/close.png" alt="close" />
          <div>
            <div>{score.current_score.name}</div>
            <div>
              <div>{score.current_score.is_long}</div>
              <VerticalLine />
              <div>{score.current_score.leverage}X</div>
            </div>
            <div>
              <div>{score.current_score.roe.toFixed(2)} %</div>
              <div>{score.current_score.pnl.toFixed(0)} USDT</div>
            </div>
          </div>
        </div>
        <div className="result_modal_after">
          <div>
            <div>매수 체결</div>
            <div>{ConvertSeconds(state.elapsed_time)}</div>
          </div>
          <div>
            <div>포지션 종료</div>
            <div>{ConvertSeconds(score.after_score.closed_time)}</div>
          </div>
          <div>
            <div>진입 후 최대 손익률</div>
            <div>{`${score.after_score.max_roe > 0 ? "+" : "-"}${(
              score.after_score.max_roe * 100
            ).toFixed(0)}% / ${score.after_score.min_roe > 0 ? "+" : ""}${(
              score.after_score.min_roe * 100
            ).toFixed(0)}%`}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getIbr(roe: number): infoByRoe {
  const info: infoByRoe = { imageUrl: "", comment: "" };
  if (roe > 0) {
    if (roe <= 0.15) {
      return { imageUrl: "/images/profit-1.gif", comment: "" };
    } else if (roe < 0.5) {
      return { imageUrl: "/images/profit-2.gif", comment: "" };
    } else if (roe < 2) {
      return { imageUrl: "/images/profit-3.gif", comment: "" };
    } else if (roe < 10) {
      return { imageUrl: "/images/profit-4.gif", comment: "" };
    } else if (roe >= 10) {
      return { imageUrl: "/images/profit-5.gif", comment: "" };
    }
  } else {
    if (roe >= -0.15) {
      info.imageUrl = "/images/loss-1.gif";
      info.comment =
        "실전 투자 전 연습이 더 필요해보여요!\n예상한 손절이라면 좋은 전략이에요.";
    } else if (roe > -0.5) {
      info.imageUrl = "/images/loss-2.gif";
      info.comment =
        "손절에 대한 대응이 익절보다 중요해요.\n잃지 않도록 손절 대응이 필요해보여요!";
    } else if (roe > -0.8) {
      info.imageUrl = "/images/loss-3.gif";
      info.comment = "당신의 손은 똥손입니까??? 절대 선물은 하지마세요...";
    } else if (roe < -0.8) {
      info.imageUrl = "/images/loss-4.gif";
      info.comment =
        "청산에 살으리랐다~ 얄라리 얄라셩\n투자는 포기하시는게....현물만 하세요...";
    }
  }
  return info;
}

export default ResultModal;
