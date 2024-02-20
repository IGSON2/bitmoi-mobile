import { useAppSelector } from "../../../hooks/hooks";
import { MypageHeader } from "../mypage_header/MypageHeader";
import "./MypageInfo.css";

export function MypageInfo() {
  const userInfo = useAppSelector((state) => state.userInfo);
  console.log(userInfo);
  return (
    <div className="mypage_info">
      <MypageHeader title="회원정보" />
      <div className="mypage_info_profile_image">
        <img src={`${userInfo.photo_url}`} alt="profile" />
      </div>
      <div className="mypage_info_nickname">{userInfo.nickname}</div>
    </div>
  );
}
