import "./App.css";
import {
  RouterProvider,
  createBrowserRouter,
  redirect,
} from "react-router-dom";
import { Home } from "./pages/Home";
import { Invest } from "./pages/invest/Invest";
import { Rank } from "./pages/Rank";
import { Mypage } from "./pages/mypage/Mypage";
import { Practice } from "./pages/invest/practice/Practice";
import Competition from "./pages/invest/competition/Competition";
import { Login } from "./pages/Login";
import { Welcome } from "./pages/Welcome";
import { Auth } from "./pages/Auth";
import { MypageInfo } from "./pages/mypage/mypage_info/MypageInfo";
import { MypageSettings } from "./pages/mypage/mypage_settings/MypageSettings";
import { MypageRecommender } from "./pages/mypage/mypage_recommender/MypageRecommender";
import { Terms } from "./pages/Terms";
import { MypageAccumulation } from "./pages/mypage/mypage_accumulation/MypageAccumulation";
import { MypageTradingHistory } from "./pages/mypage/mypage_tradingHistory/MypageTradingHistory";
import { MypageSettingsSub } from "./pages/mypage/mypage_settings/mypage_settings_sub/MypageSettingsSub";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/invest",
    element: <Invest />,
  },
  {
    path: "/invest/practice",
    element: <Practice />,
  },
  {
    path: "/invest/competition",
    element: <Competition />,
  },
  {
    path: "/rank",
    element: <Rank />,
  },
  {
    path: "/mypage",
    element: <Mypage />,
  },
  {
    path: "/mypage/info",
    element: <MypageInfo />,
  },
  {
    path: "/mypage/settings",
    element: <MypageSettings />,
  },
  {
    path: "/mypage/settings/sub",
    element: <MypageSettingsSub />,
  },
  {
    path: "/mypage/recommender",
    element: <MypageRecommender />,
  },
  {
    path: "/mypage/accumulation",
    element: <MypageAccumulation />,
  },
  {
    path: "/mypage/tradinghistory",
    element: <MypageTradingHistory />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/login/:req_url",
    element: <Login />,
  },
  {
    path: "/welcome",
    element: <Welcome />,
  },
  {
    path: "/terms",
    element: <Terms />,
  },
  {
    path: "*",
    loader: async () => {
      throw redirect("/");
    },
  },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
