import "./Pagination.css";
import { PageID } from "../types/types";

interface PaginationProps {
  pageID: number;
}
const Pagination = (props: PaginationProps) => {
  let homeImgUrl: string = "/images/pagination_home_inactive.png";
  let InvestImgUrl: string = "/images/pagination_invest_inactive.png";
  let rankImgUrl: string = "/images/pagination_rank_inactive.png";
  let myPageImgUrl: string = "/images/pagination_mypage_inactive.png";

  const goHome = () => {
    if (props.pageID === PageID.Home) return;
    window.location.href = "/home";
  };
  const goInvest = () => {
    if (props.pageID === PageID.Invest) return;
    window.location.href = "/invest";
  };
  const goRank = () => {
    if (props.pageID === PageID.Rank) return;
    window.location.href = "/rank";
  };

  const goMyPage = () => {
    if (props.pageID === PageID.MyPage) return;
    window.location.href = "/mypage";
  };

  switch (props.pageID) {
    case PageID.Home:
      homeImgUrl = "/images/pagination_home_active.png";
      break;
    case PageID.Invest:
      InvestImgUrl = "/images/pagination_invest_active.png";
      break;
    case PageID.Rank:
      rankImgUrl = "/images/pagination_rank_active.png";
      break;
    case PageID.MyPage:
      myPageImgUrl = "/images/pagination_mypage_active.png";
      break;
    default:
      homeImgUrl = "/images/pagination_home_active.png";
      break;
  }

  return (
    <div className="pagination">
      <div className="pagination_wrapper">
        <img src={homeImgUrl} onClick={goHome} alt={props.pageID.toString()} />
        <p style={props.pageID === PageID.Home ? { color: "#191919" } : {}}>
          홈
        </p>
      </div>
      <div className="pagination_wrapper">
        <img
          src={InvestImgUrl}
          onClick={goInvest}
          alt={props.pageID.toString()}
        />
        <p style={props.pageID === PageID.Invest ? { color: "#191919" } : {}}>
          모의투자
        </p>
      </div>
      <div className="pagination_wrapper">
        <img src={rankImgUrl} onClick={goRank} alt={props.pageID.toString()} />
        <p style={props.pageID === PageID.Rank ? { color: "#191919" } : {}}>
          랭킹
        </p>
      </div>
      <div className="pagination_wrapper">
        <img
          src={myPageImgUrl}
          onClick={goMyPage}
          alt={props.pageID.toString()}
        />
        <p style={props.pageID === PageID.MyPage ? { color: "#191919" } : {}}>
          마이페이지
        </p>
      </div>
    </div>
  );
};

export default Pagination;
