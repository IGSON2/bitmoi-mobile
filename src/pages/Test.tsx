import { useEffect, useState } from "react";
import "./Test.css";

export function Test() {
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  const [isPopUp, setIsPopUp] = useState(false);
  const [resizeCnt, setResizeCnt] = useState(0);

  useEffect(() => {
    const initialHeight = window.innerHeight;
    const fixedCmp = document.getElementById("test_fixed");

    document.addEventListener("focusin", () => {
      setIsPopUp(true);
      setInnerHeight(window.innerHeight);
    });

    document.addEventListener("focusout", () => {
      setIsPopUp(false);
      setInnerHeight(window.innerHeight);
      window.scrollTo(0, 1);
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
