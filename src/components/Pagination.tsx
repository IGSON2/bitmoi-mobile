import "./Pagination.css"
import { PageId, PageInfo } from "../types/types";
const Pagination = (info:PageInfo) => {
    let homeImgUrl:string="/images/home.png"; 
    let InvestImgUrl:string="/images/invest.png"; 
    let rankImgUrl:string="/images/rank.png"; 
    let myPageImgUrl:string="/images/mypage.png"; 

    const goHome = () => {
        if(info.pageId === PageId.Home) return;
        window.location.href = "/home";
    }
    const goInvest = () => {
        if(info.pageId === PageId.Invest) return;
        window.location.href = "/invest";
    }
    const goRank = () => {
        if(info.pageId === PageId.Rank) return;
        window.location.href = "/rank";
    }

    const goMyPage = () => {
        if(info.pageId === PageId.MyPage) return;
        window.location.href = "/mypage";
    }
    

    switch (info.pageId) {
        case PageId.Home:
            homeImgUrl = "/images/home_active.png";
            break;
        case PageId.Invest:
            InvestImgUrl = "/images/invest_active.png";
            break;
        case PageId.Rank:
            rankImgUrl = "/images/rank_active.png";
            break;
        case PageId.MyPage:
            myPageImgUrl = "/images/mypage_active.png";
            break;
        default:
            homeImgUrl = "/images/home_active.png";
            break;
    }

    return (
        <div className="pagination">
            <img src={homeImgUrl} onClick={goHome} alt={info.pageId.toString()}/>
            <img src={InvestImgUrl} onClick={goInvest} alt={info.pageId.toString()}/>
            <img src={rankImgUrl} onClick={goRank} alt={info.pageId.toString()}/>
            <img src={myPageImgUrl} onClick={goMyPage} alt={info.pageId.toString()}/>
        </div>
    );
}

export default Pagination;