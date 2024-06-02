import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./Pages/Home";
import { PageNotFound } from "./Pages/PageNotFound";
import { Login } from "./Pages/Login";
import { MainApp } from "./Pages/MainApp";


function App() {
  const [count, setCount] = useState(0);

  return (
    <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/hospital" element={<MainApp />}></Route>

            <Route path="/*" element={<PageNotFound />}></Route>
          </Routes>
        </BrowserRouter>
    </>
  );
}

export default App;
