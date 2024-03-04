import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export function Auth() {
  const loc = useLocation();
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    const act = new URLSearchParams(loc.search).get("accessToken");
    const ret = new URLSearchParams(loc.search).get("refreshToken");
    if (act === null || ret === null) {
      setErrorMsg("인증에 실패했습니다. 다시 로그인해주세요.");
      return;
    }
    localStorage.setItem("accessToken", act);
    localStorage.setItem("refreshToken", ret);

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

  return (
    <div>
      {errorMsg}
      <button
        style={{
          border: "none",
          backgroundColor: "white",
          cursor: "pointer",
          width: "100px",
          height: "50px",
          fontSize: "20px",
        }}
        onClick={() => {
          window.location.href = `/`;
        }}
      >
        홈으로
      </button>
    </div>
  );
}
