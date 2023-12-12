import { RouterProvider,  createBrowserRouter, redirect } from 'react-router-dom';
import './App.css';
import { Home } from './components/Home';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
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
      <div className="App_main_wrap">
        <Header />
        <RouterProvider router={router} />
      </div>
      <Footer />
    </div>
  );
}

export default App;
