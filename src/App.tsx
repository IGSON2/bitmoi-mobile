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
import { transform } from "@babel/core";
import React from "react";

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
    path: "/login",
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
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      document.documentElement.style.transform = "scale(1)";
    }
  };
  return (
    <div className="App" onTouchStart={handleTouchStart}>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
