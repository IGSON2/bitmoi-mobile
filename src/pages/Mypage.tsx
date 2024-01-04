import { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import { PageId, PageInfo } from "../types/types";
import "./Mypage.css";
import { axiosClient } from "../utils/axiosClient";

export const Mypage = () => {
    const [loginURL, setLoginURL] = useState<string>("");
    useEffect(() => {
        axiosClient.get("/oauth").then((res) => setLoginURL(res.data));
    },[]);
    const pageInfo:PageInfo = {
        pageId: PageId.MyPage,
    }
    return (
        <div className="mypage">
            <h1>Mypage</h1>
            <a href={loginURL}>로그인</a>
            <Pagination {...pageInfo} /> {/* 객체의 전개 연산자 */}
        </div>
    );
}