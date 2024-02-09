import { useAppDispatch } from "../../../hooks/hooks";
import { setPositionClosed } from "../../../store/positionClosed";
import { setStageAddRefreshCnt } from "../../../store/stageState";
import "./Review.css";

export function Review() {
  const dispatch = useAppDispatch();

  const handleNextChart = () => {
    dispatch(setStageAddRefreshCnt());
  };

  const handleReplayResult = () => {
    dispatch(setPositionClosed(true));
  };

  return (
    <div className="review">
      <button onClick={handleNextChart} style={{ background: "#BFBFBF" }}>
        다음 차트보기
      </button>
      <button onClick={handleReplayResult}>결과 다시보기</button>
    </div>
  );
}
