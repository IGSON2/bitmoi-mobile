import { useEffect, useState } from "react";
import "./Test.css";

export function Test() {
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  const [isPopUp, setIsPopUp] = useState(false);
  const [resizeCnt, setResizeCnt] = useState(0);
  const [count, setCount] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timer | null>(null);

  const startInterval = async () => {
    if (intervalId === null) {
      const id = setInterval(() => {
        setCount((prevCount) => prevCount + 1);
      }, 1000);
      setIntervalId(id);
    } else {
      stopInterval();
    }
  };

  const stopInterval = () => {
    if (intervalId !== null) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };
  useEffect(() => {
    document.addEventListener("focusin", () => {
      setIsPopUp(true);
      setInnerHeight(window.innerHeight);
    });

    document.addEventListener("focusout", () => {
      setIsPopUp(false);
      setInnerHeight(window.innerHeight);
      window.scrollTo(0, 1); // 키보드 팝업으로 인한 fixed component의 CSS 깨짐 현상 해결
    });

    document.addEventListener("resize", () => {
      setResizeCnt(resizeCnt + 1);
    });

    return (
      document.removeEventListener("focusin", () => {
        setIsPopUp(true);
        setInnerHeight(window.innerHeight);
      }),
      document.removeEventListener("focusout", () => {
        setIsPopUp(false);
        setInnerHeight(window.innerHeight);
      })
    );
  }, []);
  return (
    <div className="Test">
      <div className="Test_div"></div>
      <div className="Test_fixed_div" id="test_fixed">
        <div className="Test_input">{`${innerHeight} ${isPopUp} ${resizeCnt}`}</div>
        <div className="Test_input">
          <div>{count}</div>
          <button onClick={startInterval}>start</button>
          <button onClick={stopInterval}>stop</button>
        </div>
        <div className="Test_input">
          <input></input>
          <select>
            <option>1</option>
            <option>1</option>
            <option>1</option>
            <option>1</option>
            <option>1</option>
            <option>1</option>
            <option>1</option>
            <option>1</option>
            <option>1</option>
            <option>1</option>
            <option>1</option>
            <option>1</option>
            <option>1</option>
            <option>1</option>
            <option>1</option>
            <option>1</option>
            <option>1</option>
            <option>1</option>
            <option>1</option>
            <option>1</option>
            <option>1</option>
            <option>1</option>
          </select>
        </div>
        <div className="Test_input">
          <input></input>
          <select>
            <option>1</option>
            <option>1</option>
            <option>1</option>
            <option>1</option>
            <option>1</option>
            <option>1</option>
            <option>1</option>
            <option>1</option>
            <option>1</option>
            <option>1</option>
            <option>1</option>
            <option>1</option>
            <option>1</option>
            <option>1</option>
            <option>1</option>
            <option>1</option>
            <option>1</option>
            <option>1</option>
            <option>1</option>
            <option>1</option>
            <option>1</option>
            <option>1</option>
          </select>
        </div>
      </div>
    </div>
  );
}
