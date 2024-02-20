import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function Auth() {
  const loc = useLocation();

  useEffect(() => {
    localStorage.setItem(
      "accessToken",
      new URLSearchParams(loc.search).get("accessToken")!
    );
    localStorage.setItem(
      "refreshToken",
      new URLSearchParams(loc.search).get("refreshToken")!
    );
    const attendanceReward = new URLSearchParams(loc.search).get(
      "attendanceReward"
    )!;
    if (attendanceReward !== "") {
      alert(
        `출석 체크 완료!\n연습모드 계좌로 ${Number(
          attendanceReward
        ).toLocaleString()} USDP가 지급되었습니다.`
      );
    }
    let originPath = new URLSearchParams(loc.search).get("path")!;
    if (originPath === "practice" || originPath === "competition/") {
      originPath = "invest/" + originPath;
    }

    window.location.href = `/${originPath}`;
  }, []);

  return <div></div>;
}
