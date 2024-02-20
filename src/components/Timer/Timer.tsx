import { useEffect, useState } from "react";
import "./Timer.css";

export interface TimerProps {
  timeMilliStamp: number;
}

export function Timer(props: TimerProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const updateCountdown = () => {
    const currentTime = Date.now();
    const timeDiff = props.timeMilliStamp - currentTime;
    if (timeDiff <= 0) {
      window.location.reload();
    }
    setRemainingSeconds(Math.floor(timeDiff / 1000));
  };

  useEffect(() => {
    const interval = setInterval(updateCountdown, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const days = Math.floor(remainingSeconds / 86400);
  const hours = Math.floor((remainingSeconds % 86400) / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  return (
    <div className="timer">
      <div>{`${days > 0 ? days.toString().padStart(2, "0") + ":" : ""}`}</div>
      <div>{`${hours > 0 ? hours.toString().padStart(2, "0") + ":" : ""}`}</div>
      <div>{`${
        minutes > 0 ? minutes.toString().padStart(2, "0") + ":" : ""
      }`}</div>
      <div>{`${seconds > 0 ? seconds.toString().padStart(2, "0") : ""}`}</div>
    </div>
  );
}
