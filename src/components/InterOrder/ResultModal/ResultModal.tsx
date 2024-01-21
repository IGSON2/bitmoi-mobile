import { useAppDispatch } from "../../../hooks/hooks";
import { setPositionClosed } from "../../../store/positionClosed";
import { setSubmit } from "../../../store/submit";
import "./ResultModal.css";

function ResultModal() {
    const dispatch = useAppDispatch();

    function close(){
        dispatch(setSubmit(false));
        dispatch(setPositionClosed(false));
    }

  return (
    <div className="result_modal">
        <div className="result_modal_blank"></div>
      <div className="result_modal_box">
        <div className="result_modal_title">결과</div>
        <button onClick={close}>닫기</button>
      </div>
    </div>
  );
}

export default ResultModal;