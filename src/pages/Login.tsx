import { useLocation, useParams } from "react-router-dom";
import "./Login.css";
import { useEffect } from "react";

export const Login = () => {
  const { req_url } = useParams();
  const loc = useLocation();

  useEffect(() => {
    const recommender = new URLSearchParams(loc.search).get("recommender")!;
    if (recommender) {
      localStorage.setItem("recommender", recommender);
    }
  }, []);

  function login() {
    const apiURL = process.env.REACT_APP_API_URL || "https://api.bitmoi.co.kr";
    window.location.href = `${apiURL}/oauth/${req_url}`;
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
        {"비트모이는 구글 이메일이 있어야 서비스 이용이 가능합니다."}
      </div>
      <img
        className="login_oauth"
        src="/images/google_login.png"
        alt="google_login"
        onClick={login}
      />
    </div>
  );
};
