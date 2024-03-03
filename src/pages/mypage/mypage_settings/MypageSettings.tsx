import { MypageHeader } from "../mypage_header/MypageHeader";
import "./MypageSettings.css";

export const option_alram = "alram";

export function MypageSettings() {
  return (
    <div className="mypage_settings">
      <MypageHeader title="설정" backLink="mypage" />
      <div className="mypage_settings_list_wrapper">
        <div
          className="mypage_settings_list"
          onClick={() => {
            window.location.href = `/mypage/settings/sub/?option=${option_alram}`;
          }}
        >
          <p>알람</p>
          <img src="/images/mypage_settings_arrow.png" alt="arrow" />
        </div>
      </div>
    </div>
  );
}
