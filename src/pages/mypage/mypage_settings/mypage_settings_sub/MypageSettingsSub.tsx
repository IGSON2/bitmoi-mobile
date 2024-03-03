import { MypageHeader } from "../../mypage_header/MypageHeader";
import "./MypageSettingsSub.css";

export function MypageSettingsSub() {
  return (
    <div className="mypage_settings">
      <MypageHeader title="설정" backLink="mypage/settings" />
      <div className="mypage_settings_list_wrapper">
        <div className="mypage_settings_list">
          <p>{}</p>
          <img src="/images/mypage_settings_arrow.png" alt="arrow" />
        </div>
      </div>
    </div>
  );
}
