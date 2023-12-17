import "./App.css"
import { RouterProvider,  createBrowserRouter, redirect } from 'react-router-dom';
import { Home } from './pages/Home';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Invest } from './pages/Invest';
import { Rank } from './pages/Rank';
import { Mypage } from './pages/Mypage';

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
    path: "/rank",
    element: <Rank />,
  },
  {
    path: "/mypage",
    element: <Mypage />,
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
      <Header />
      <RouterProvider router={router} />
      <Footer />
    </div>
  );
}

export default App;
