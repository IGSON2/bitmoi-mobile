import Pagination from "../components/Pagination";
import { PageId, PageInfo } from "../types/types";
import "./Home.css";

export const Home = () => {
    const pageInfo:PageInfo = {
        pageId: PageId.Home,
        href: "/"
    }
    return (
        <div className="home">
            <h1>Home</h1>
            <p>
                비트모이는 과거 임의의 시점을 시뮬레이팅해 주는 모의투자 플랫폼입니다.
                <br />
                실제 데이터에 기반한 다양한 프렉털을 제공하여 여러 패턴들에 대응할 수
                있도록 트레이더님의 기술적 감각을 길러드립니다.
                <br />총 10번의 트레이딩으로 진입 시점으로부터 24시간 뒤의 가격을
                예측해 시드머니를 늘려나가 보세요.
            </p>
            <Pagination {...pageInfo} /> {/* 객체의 전개 연산자 */}
        </div>
    );
}