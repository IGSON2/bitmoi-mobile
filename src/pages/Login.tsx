import { useLocation, useParams } from "react-router-dom";
import "./Login.css";
import { useEffect, useState } from "react";

export const Login = () => {
  const { req_url } = useParams();
  const loc = useLocation();

  const [isKakao, setIsKakao] = useState<boolean>(false);

  useEffect(() => {
    const recommender = new URLSearchParams(loc.search).get("recommender")!;
    if (recommender) {
      localStorage.setItem("recommender", recommender);
    }
    navigator.userAgent.includes("KAKAOTALK")
      ? setIsKakao(true)
      : setIsKakao(false);
  }, []);

  function googleLogin() {
    const apiURL = process.env.REACT_APP_API_URL || "https://api.bitmoi.co.kr";
    window.location.href = `${apiURL}/basic/oauth/${req_url}?platform=google`;
  }

  function kakaoLogin() {
    const apiURL = process.env.REACT_APP_API_URL || "https://api.bitmoi.co.kr";
    window.location.href = `${apiURL}/basic/oauth/${req_url}?platform=kakao`;
  }

  return (
    <div className="login">
      <img
        className="home_back"
        onClick={() => {
          window.location.href = "/";
        }}
        src="/images/left_arrow.png"
        alt="back"
      />
      <h3 className="login_title">Bitmoi</h3>
      <img className="login_logo" alt="logo" src="/images/bitmoi.png" />
      <div className="login_info">
        {"비트모이는 간편 로그인을 통한 가입을 지원합니다."}
      </div>
      <div className="login_oauth_wrapper">
        {!isKakao ? (
          <img
            className="login_oauth"
            src="/images/google_login.png"
            alt="google_login"
            onClick={googleLogin}
          />
        ) : null}
        <img
          className="login_oauth"
          src="/images/kakao_login.png"
          alt="kakao_login"
          onClick={kakaoLogin}
        />
      </div>
    </div>
  );
};
