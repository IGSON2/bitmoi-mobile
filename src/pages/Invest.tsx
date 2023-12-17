import Pagination from "../components/Pagination";
import { PageId, PageInfo } from "../types/types";
import "./Invest.css";

export const Invest = () => {
    const pageInfo:PageInfo = {
        pageId: PageId.Invest,
        href: "/"
    }
    return (
        <div className="invest">
            <h1>Invest</h1>
            <Pagination {...pageInfo} /> {/* 객체의 전개 연산자 */}
        </div>
    );
}