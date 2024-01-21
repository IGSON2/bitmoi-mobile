import { useLocation, useParams } from "react-router-dom";
import "./Welcome.css";
import { useEffect } from "react";

export const Welcome = () => {
    const {accessToken,refreshToken} = useParams();
    const loc = useLocation();
    localStorage.setItem("accessToken", new URLSearchParams(loc.search).get("accessToken")!);
    localStorage.setItem("refreshToken", new URLSearchParams(loc.search).get("refreshToken")!);

    useEffect(() => {
        if(accessToken !== undefined && refreshToken !== undefined){
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
        }
    },[]);


    return (
        <div className="welcome">
            <h3>시뮬레이션 모의투자 비트모이의 회원이 되신 것을 축하드립니다!</h3>
            <button onClick={()=>{window.location.href="/invest/practice"}}>모의투자 하러 가기</button>
        </div>
    );
}