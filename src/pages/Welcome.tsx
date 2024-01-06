import { useParams } from "react-router-dom";
import "./Welcome.css";
import { useEffect } from "react";

export const Welcome = () => {
    const {accessToken,refreshToken} = useParams();

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
        </div>
    );
}