import { useEffect, useState } from "react";
import "./Welcome.css";

export const Welcome = () => {
  const [code, setCode] = useState("");

  const [blockInput, setBlockInput] = useState(false);
  useEffect(() => {
    const recommender = localStorage.getItem("recommender");
    if (recommender) {
      setCode(recommender);
      localStorage.removeItem("recommender");
      setBlockInput(true);
    }
  }, []);

  async function submitCode() {
    {
      /* 추천인 등록 API 연동 */
    }
    alert("개발중");
  }

  return (
    <div className="welcome">
      <h3>시뮬레이션 모의투자 비트모이의 회원이 되신 것을 축하드립니다!</h3>
      <input
        className="welcome_input"
        type="text"
        placeholder="추천인 코드를 입력해주세요."
        value={code}
        disabled={blockInput}
      ></input>
      <p className="welcome_comment">
        추천인을 적지 않아도 가입 완료가 가능합니다.
      </p>
      <button
        onClick={() => {
          window.location.href = "/invest/practice";
        }}
      >
        모의투자 하러 가기
      </button>
    </div>
  );
};
