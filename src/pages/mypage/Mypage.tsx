import { useEffect, useState } from "react";
import Pagination from "../../components/Pagination";
import { PageID, UserInfo } from "../../types/types";
import "./Mypage.css";
import { checkAccessTokenValidity } from "../../utils/checkAccessTokenValidity";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { setUserInfo } from "../../store/userInfo";
import { LoginModal } from "../../components/modals/LoginModal";
import { useNavigate } from "react-router-dom";

export const Mypage = () => {
  const [isLogined, setIsLogined] = useState<boolean>(true);
  const [tokenBal, setTokenBal] = useState<number>(0);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userInfo = useAppSelector((state) => state.userInfo);

  useEffect(() => {
    async function GetUserInfo() {
      const userRes = await checkAccessTokenValidity("mypage");
      if (!userRes) {
        setIsLogined(false);
      } else {
        dispatch(setUserInfo(userRes as UserInfo));
        setIsLogined(true);
      }
    }
    GetUserInfo();
  }, []);

  function logout() {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/";
    } else {
      return;
    }
  }

  return (
    <div className="mypage">
      <h1>마이 페이지</h1>
      <div className="mypage_body">
        <div className="mypage_point_wrapper">
          <div className="mypage_point">
            <div style={{ fontWeight: "600" }}>Point</div>
            <div>
              {`${userInfo.prac_balance.toFixed(2)} `}
              <span>USDP</span>
            </div>
          </div>
          <div className="mypage_point">
            <div style={{ fontWeight: "600" }}>Token</div>
            <div>
              {`${tokenBal} `}
              <span>MOI</span>
            </div>
          </div>
        </div>
        <div className="mypage_icon_wrapper">
          <div
            className="mypage_icon"
            onClick={() => {
              navigate("/mypage/info");
            }}
          >
            <img src="/images/mypage_profile.png" />
            <div>회원정보</div>
          </div>
          <div
            className="mypage_icon"
            onClick={() => {
              navigate("/mypage/settings");
            }}
          >
            <img src="/images/mypage_setting.png" />
            <div>설정</div>
          </div>
        </div>
        <div className="mypage_menu_wrapper">
          <div
            className="mypage_menu"
            onClick={() => {
              navigate("/mypage/tradinghistory");
            }}
          >
            <img src="/images/mypage_list.png" />
            <div>거래내역</div>
          </div>
          <div
            className="mypage_menu"
            onClick={() => {
              navigate("/mypage/accumulation");
            }}
          >
            <img src="/images/mypage_list_2.png" />
            <div>적립내역</div>
          </div>
          <div
            className="mypage_menu"
            onClick={() => {
              navigate("/mypage/recommender");
            }}
          >
            <img src="/images/mypage_list.png" />
            <div>추천인</div>
          </div>
          <div
            className="mypage_menu"
            onClick={() => {
              window.open("https://open.kakao.com/o/gu5jaTHd", "_blank");
            }}
          >
            <img src="/images/mypage_list_2.png" />
            <div>고객센터</div>
          </div>
        </div>
        <div className="mypage_logout" onClick={logout}>
          로그아웃
        </div>
      </div>
      <Pagination pageID={PageID.MyPage} /> {/* 객체의 전개 연산자 */}
      {isLogined ? null : <LoginModal reqUrl="mypage" balckLink="/" />}
    </div>
  );
};
