import { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import { PageId, PageInfo } from "../types/types";
import "./Mypage.css";
import axiosClient from "../utils/axiosClient";

export const Mypage = () => {
  const pageInfo: PageInfo = {
    pageId: PageId.MyPage,
  };
  useEffect(() => {
    async function getUserInfo() {}
    getUserInfo();
  }, []);
  return (
    <div className="mypage">
      <h1>Mypage</h1>
      <Pagination {...pageInfo} /> {/* 객체의 전개 연산자 */}
    </div>
  );
};
