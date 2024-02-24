import { useState } from "react";
import Pagination from "../components/Pagination";
import { PageId, PageInfo } from "../types/types";
import "./Home.css";

type ServiceFeature = {
  title: string;
  description: string[];
};

const appVersion = process.env.REACT_APP_VERSION;

export const Home = () => {
  const pageInfo: PageInfo = {
    pageId: PageId.Home,
  };

  const serviceFeature: ServiceFeature[] = [
    {
      title: "빠른 경험을 위한",
      description: [
        "투자의 두려움, 경험이 부족해도 걱정하지 마세요.",
        "과거 특정 시간의 상황으로 돌아가 진입하여 빠른 결과를 도출하는",
        "백테스팅형태의 모의투자 서비스",
      ],
    },
    {
      title: "다양한 프랙탈, 페어",
      description: [
        "현물 투자자의 투자 한계를 벗어난 선물 기반 오더를 통해",
        "다양한 진입으로 연습의 기회를 제공",
      ],
    },
    {
      title: "나만의 투자 방법",
      description: [
        "창의력과 아이디어가 더 큰 가치를 창출합니다.",
        "모의투자를 통해 당신만의 투자 전략을 발견하고",
        "미래의 성공을 향한 첫 걸음을 내딛어보세요.",
      ],
    },
  ];

  const homeDiv = document.getElementById("home_div");

  const [isTipOpen, setIsTipOpen] = useState(false);
  return (
    <div className="home" id="home_div">
      <img className="home_logo" src="/images/bitmoi.png" />
      <div className="home_title">
        <div className="home_title_service">OUR SERVICE</div>
        <div className="home_title_phrase">투자의 문턱을 낮추는 모의투자</div>
      </div>
      <div className="home_service_feature_wrapper">
        {serviceFeature.map((feature, index) => {
          return (
            <div className="home_service_feature" key={index}>
              <div className="home_service_feature_title_wrapper">
                <img src="/images/home_feature.png" alt="V" />
                <div className="home_service_feature_title">
                  {feature.title}
                </div>
              </div>
              <div className="home_service_feature_description">
                {feature.description.map((desc, index) => {
                  return (
                    <p
                      className="home_service_feature_description_item"
                      key={index}
                    >
                      {desc}
                    </p>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div className="home_tip_wrapper">
        <div className="home_tip">TIP</div>
        <div className="home_tip_description">
          비트모이 쉽고 편하게 이용하기!!!
        </div>
        {isTipOpen ? null : (
          <button
            className="home_tip_toggle"
            onClick={() => {
              setIsTipOpen(true);
            }}
          >
            펼치기
          </button>
        )}

        {!isTipOpen ? null : (
          <div className="home_tip_detail">
            <ol className="home_tip_detail_ol">
              <li>
                Chrome으로 비트모이 사이트를 열어주세요.
                <p className="home_tip_url">m.bitmoi.co.kr</p>
              </li>
              <li>주소 표시줄 오른쪽 상단에서 공유아이콘 클릭!</li>
              <img src="/images/home_tip_1.png" alt="tip_1" />
              <li>홈 화면에 추가 클릭!</li>
              <img src="/images/home_tip_2.png" alt="tip_2" />
            </ol>
            <div
              className="home_tip_arrow"
              onClick={() => {
                setIsTipOpen(false);
                homeDiv?.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <img
                src="/images/upper_arrow.png"
                alt="top"
                style={{ width: "45px", height: "45px" }}
              />
            </div>
          </div>
        )}
      </div>
      <img
        src="/images/kakao_support.png"
        alt="tip_3"
        style={{ marginTop: "30px" }}
      />
      <div className="home_terms_wrapper">
        <h5>이용약관 개인정보 취급방침</h5>
        <div className="home_terms_company_info">
          <div>회사명 : 비트모이</div>
          <div>사업장 주소 : 서울 강남</div>
          <div>광고 및 문의 메일 : support@bitmoi.co.kr</div>
          <div>Copyright &copy; BITMOI All right reserved.</div>
          <div>{`v${appVersion}`}</div>
        </div>
      </div>
      <Pagination {...pageInfo} /> {/* 객체의 전개 연산자 */}
    </div>
  );
};
