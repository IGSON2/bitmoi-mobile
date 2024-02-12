import "./App.css";
import {
  RouterProvider,
  createBrowserRouter,
  redirect,
} from "react-router-dom";
import { Home } from "./pages/Home";
import { Invest } from "./pages/invest/Invest";
import { Rank } from "./pages/Rank";
import { Mypage } from "./pages/Mypage";
import { Practice } from "./pages/invest/practice/Practice";
import Competition from "./pages/invest/competition/Competition";
import { Login } from "./pages/Login";
import { Welcome } from "./pages/Welcome";
import { Auth } from "./pages/Auth";

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
