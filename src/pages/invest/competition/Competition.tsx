import { ComingSoon } from "../../../components/comingSoon/ComingSoon";
import "./Competition.css";

const Competition = () => {
  return (
    <div className="competition">
      <h1>경쟁모드</h1>
      <ComingSoon name="경쟁모드" description="경쟁모드를 통해 비트모이 토큰을 획득할 수 있어요." href="invest"/>
    </div>
  );
};
export default Competition;
