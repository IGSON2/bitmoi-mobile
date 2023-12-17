import Pagination from "../components/Pagination";
import { PageId, PageInfo } from "../types/types";
import "./Mypage.css";

export const Mypage = () => {
    const pageInfo:PageInfo = {
        pageId: PageId.MyPage,
        href: "/"
    }
    return (
        <div className="mypage">
            <h1>Mypage</h1>
            <Pagination {...pageInfo} /> {/* 객체의 전개 연산자 */}
        </div>
    );
}