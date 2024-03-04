import { useEffect, useState } from "react";
import "./OptionAlram.css";
export function OptionAlram() {
  const [isChecked, setIsChecked] = useState<boolean | null>(null);
  const [permission, setPermission] = useState<boolean | null>(null);

  const [comment, setComment] = useState<string>(
    "현재 모든 알람에 대해 꺼져있습니다."
  );

  useEffect(() => {
    if ("Notification" in window) {
      const permissionStatus = Notification.permission;
      if (permissionStatus === "granted") {
        setIsChecked(true);
        setPermission(true);
      } else if (permissionStatus === "denied") {
        setIsChecked(false);
        setPermission(false);
      }
    } else {
      setComment("현재 사용중인 브라우저는 알림을 지원하지 않습니다.");
    }
  }, []);

  useEffect(() => {
    async function reqPermission() {
      if ("Notification" in window) {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          setPermission(true);
          setIsChecked(true);
        } else if (permission === "denied") {
          setPermission(false);
          setIsChecked(false);
        }
      } else {
        setComment("현재 사용중인 브라우저는 알림을 지원하지 않습니다.");
      }
    }
    if (isChecked !== null) {
      reqPermission();
    }
  }, [isChecked]);

  useEffect(() => {
    if (permission === true) {
      setComment(
        "알림 권한이 이미 허용되었습니다. 브라우저 설정에서 수동으로 변경해 주세요"
      );
    } else if (permission === false) {
      setComment(
        "알림 권한이 이미 거부되었습니다. 브라우저 설정에서 수동으로 변경해 주세요"
      );
    }
  }, [permission]);

  return (
    <div className="option_alram">
      <div className="option_wrapper">
        <div>알람</div>
        {permission === null ? (
          <input
            className="checkbox"
            role="switch"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (permission === null) {
                setIsChecked(e.currentTarget.checked);
              }
            }}
            type="checkbox"
          />
        ) : null}
      </div>
      <div className="option_comment">{comment}</div>
    </div>
  );
}
