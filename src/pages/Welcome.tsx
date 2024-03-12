import { useEffect, useState } from "react";
import "./Welcome.css";
import { checkAccessTokenValidity } from "../utils/checkAccessTokenValidity";
import axiosClient from "../utils/axiosClient";
import { LoginModal } from "../components/modals/LoginModal";
import axios from "axios";

export const Welcome = () => {
  const codePattern = /^[a-fA-F0-9]{10,10}$/;

  const [code, setCode] = useState("");

  const [isLogined, setIsLogined] = useState<boolean>(true);
  const [isRecommended, setIsRecommended] = useState(false);

  useEffect(() => {
    async function initData() {
      const userRes = await checkAccessTokenValidity("welcome");
      if (!userRes) {
        setIsLogined(false);
      } else {
        setIsLogined(true);
      }

      const recommender = localStorage.getItem("recommender");
      if (recommender !== null) {
        setCode(recommender);
        setIsRecommended(true);
      }
    }
    initData();
  }, []);

  function handleCodeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCode(e.target.value);
  }

  async function submitCode() {
    if (code !== "") {
      if (!codePattern.test(code)) {
        alert("추천인 코드가 올바르지 않습니다.");
        return;
      }
      try {
        const res = await axiosClient.post("/auth/user/recommender", {
          code: code,
        });
        if (isRecommended) {
          localStorage.removeItem("recommender");
        }
        alert(
          `비트모이를 추천해 주신 ${res.data.recommender}님 에게 리워드가 전달되었습니다.`
        );
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errRes = error.response?.data;
          if (errRes.includes("cannot find recommender")) {
            alert(
              "존재하지 않는 추천인입니다. 추천인 코드를 다시 확인해 주세요."
            );
          }
        }
        console.error(error);
      }
    }
    window.location.href = "/";
  }

  return (
    <div className="welcome">
      <h3>시뮬레이션 모의투자 비트모이의 회원이 되신 것을 축하드립니다!</h3>
      <input
        className="welcome_input"
        type="text"
        placeholder="추천인 코드를 입력해주세요."
        value={code}
        onChange={handleCodeChange}
        disabled={isRecommended}
      ></input>
      <p className="welcome_comment">
        추천인을 적지 않아도 가입 완료가 가능합니다.
      </p>
      <button onClick={submitCode}>가입완료</button>
      {isLogined ? null : <LoginModal reqUrl="welcome" balckLink="/" />}
    </div>
  );
};
