import { useEffect, useState } from "react";
import "./OptionAlram.css";
export function OptionAlram() {
  const [isChecked, setIsChecked] = useState<boolean | null>(null);
  const [permission, setPermission] = useState<boolean | null>(null);

  const [comment, setComment] = useState<string>(
    "현재 모든 알람에 대해 꺼져있습니다."
  );

  useEffect(() => {
    const permissionStatus = Notification.permission;
    if (permissionStatus === "granted") {
      setIsChecked(true);
      setPermission(true);
    } else if (permissionStatus === "denied") {
      setIsChecked(false);
      setPermission(false);
    }
  }, []);

  useEffect(() => {
    async function reqPermission() {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setPermission(true);
        setIsChecked(true);
      } else {
        setPermission(false);
        setIsChecked(false);
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
