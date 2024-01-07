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
            console.log(accessToken,refreshToken);
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
        }
    },[]);


    return (
        <div className="Welcome">
            <h1>Welcome</h1>
            <button onClick={()=>{window.location.href="/invest/practice"}}>모의투자 하러 가기</button>
        </div>
    );
}