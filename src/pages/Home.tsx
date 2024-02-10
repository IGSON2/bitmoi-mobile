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
        "모의투자 플랫폼에서는 실패 없는",
        "투자 여정을 체험하세요.",
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
  return (
    <div className="home">
      <div
        style={{
          position: "fixed",
          top: "20px",
          right: "30px",
          color: "#999999",
        }}
      >
        {`v${appVersion}`}
      </div>
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
      <div className="home_tip">TIP</div>
      <div className="home_tip_description">
        비트모이 쉽고 편하게 이용하기!!!
      </div>
      <button className="home_tip_toggle">펼치기</button>
      <Pagination {...pageInfo} /> {/* 객체의 전개 연산자 */}
    </div>
  );
};
