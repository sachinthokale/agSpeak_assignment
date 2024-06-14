import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import OrderPage from "./pages/OrderPage";

const App = () => {
  const isAuthenticated = localStorage.getItem("username") ? true : false;

  return (
    <>
      <BrowserRouter>
        {isAuthenticated ? (
          <Routes>
            <Route path="/" element={<OrderPage />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<Login />} />
          </Routes>
        )}
      </BrowserRouter>
    </>
  );
};

export default App;
