import { useEffect } from "react";
import "./Loader.css";
function Loader() {
  useEffect(() => {
    //TODO : 10초동안 로딩 안되면 에러 띄우기
  }, []);
  return (
    <div className="loaderpage">
      <div className="catchphrase">
        <img className="bgimg" src="/images/bitmoi.png" alt="logo" />
        <div className="sentence">시뮬레이션 모의투자 비트모이!</div>
      </div>
    </div>
  );
}

export default Loader;
