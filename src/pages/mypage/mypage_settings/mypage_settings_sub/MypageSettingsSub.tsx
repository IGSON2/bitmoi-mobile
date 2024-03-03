import { useLocation } from "react-router-dom";
import { MypageHeader } from "../../mypage_header/MypageHeader";
import "./MypageSettingsSub.css";
import { useEffect, useState } from "react";
import { option_alram } from "../MypageSettings";
import { OptionAlram } from "./setting_options/OptionAlram";

type SettingInfo = {
  title: string;
  component: JSX.Element;
};

export function MypageSettingsSub() {
  const loc = useLocation();
  const [info, setInfo] = useState<SettingInfo>({
    title: "",
    component: <div></div>,
  });

  useEffect(() => {
    const option = new URLSearchParams(loc.search).get("option");
    if (option === null) return;
    setInfo(switchByOption(option));
  }, []);

  return (
    <div className="mypage_settings_sub">
      <MypageHeader title="알람" backLink="mypage/settings" />
      <div className="mypage_settings_sub_option_wrapper">{info.component}</div>
    </div>
  );
}

function switchByOption(option: string): SettingInfo {
  switch (option) {
    case option_alram:
      return {
        title: "알람",
        component: <OptionAlram />,
      };
    default:
      return {
        title: "알람",
        component: <OptionAlram />,
      };
  }
}
