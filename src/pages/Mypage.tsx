import { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import { PageId, PageInfo, UserInfo } from "../types/types";
import "./Mypage.css";
import { checkAccessTokenValidity } from "../utils/checkAccessTokenValidity";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { setUserInfo } from "../store/userInfo";
import { LoginModal } from "../components/modals/LoginModal";

export const Mypage = () => {
  const pageInfo: PageInfo = {
    pageId: PageId.MyPage,
  };

  const [isLogined, setIsLogined] = useState<boolean>(false);
  const [tokenBal, setTokenBal] = useState<number>(0);

  const dispatch = useAppDispatch();
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

  return (
    <div className="mypage">
      <h3>Mypage</h3>
      <div className="mypage_body">
        <div className="mypage_point_wrapper">
          <div className="mypage_point">
            <div>Point</div>
            <div>
              {`${userInfo.prac_balance.toFixed(2)} `}
              <span>USDP</span>
            </div>
          </div>
          <div className="mypage_point">
            <div>Token</div>
            <div>
              {`${tokenBal} `}
              <span>MOI</span>
            </div>
          </div>
        </div>
        <div className="mypage_icon_wrapper">
          <div className="mypage_icon">
            <img src="/images/profile.png" />
            <div>회원정보</div>
          </div>
          <div className="mypage_icon">
            <img src="/images/setting.png" />
            <div>설정</div>
          </div>
        </div>
        <div className="mypage_menu_wrapper">
          <div className="mypage_menu">
            <img src="/images/mypage_list.png" />
            <div>거래내역</div>
          </div>
          <div className="mypage_menu">
            <img src="/images/mypage_list.png" />
            <div>적립내역</div>
          </div>
          <div className="mypage_menu">
            <img src="/images/mypage_list.png" />
            <div>고객센터</div>
          </div>
          <div className="mypage_menu" style={{ marginTop: "50px" }}>
            <img src="/images/mypage_list.png" />
            <div>추천인</div>
          </div>
        </div>
      </div>
      <Pagination {...pageInfo} /> {/* 객체의 전개 연산자 */}
      {isLogined ? null : <LoginModal reqUrl="mypage" />}
    </div>
  );
};
