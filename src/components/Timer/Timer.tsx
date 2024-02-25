import { useEffect, useState } from "react";
import "./Timer.css";

export interface TimerProps {
  timeMilliStamp: number;
}

export const expiringMinute = Number(process.env.REACT_APP_TIMER);

export function Timer(props: TimerProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isReload, setIsReload] = useState(false);

  const updateCountdown = () => {
    const currentTime = Date.now();
    const timeDiff = props.timeMilliStamp - currentTime;
    if (timeDiff <= 0) {
      setIsReload(true);
    }
    setRemainingSeconds(Math.floor(timeDiff / 1000));
  };

  useEffect(() => {
    const interval = setInterval(updateCountdown, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (isReload) {
      alert(
        `${expiringMinute}분 동안 포지션 진입이 감지되지 않아 페이지를 새로고침합니다.`
      );
      window.location.reload();
    }
  }, [isReload]);

  const days = Math.floor(remainingSeconds / 86400);
  const hours = Math.floor((remainingSeconds % 86400) / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  return (
    <div className="timer">
      <img src="/images/timer.png" alt="timer" />
      <div>{`${days > 0 ? days.toString().padStart(2, "0") + ":" : ""}`}</div>
      <div>{`${hours > 0 ? hours.toString().padStart(2, "0") + ":" : ""}`}</div>
      <div>{`${
        minutes > 0 ? minutes.toString().padStart(2, "0") + ":" : "00:"
      }`}</div>
      <div>{`${seconds > 0 ? seconds.toString().padStart(2, "0") : "00"}`}</div>
    </div>
  );
}
