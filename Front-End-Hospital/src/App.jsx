import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./Pages/Home";
import { PageNotFound } from "./Pages/PageNotFound";
import { Login } from "./Pages/Login";
import { MainApp } from "./Pages/MainApp";
import { UsuarioProvider } from "./Contexts/UsuarioContext";
import { PatologiaProvider } from "./Contexts/PatologiaContext";
import { RecetaProvider } from "./Contexts/RecetaContext";
import { InformacionProvider } from "./Contexts/InformacionContext";
import { EjercicioProvider } from "./Contexts/EjercicioContext";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <InformacionProvider>
        <EjercicioProvider>
          <UsuarioProvider>
            <PatologiaProvider>
              <RecetaProvider>
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Home />}></Route>
                    <Route path="/login" element={<Login />}></Route>
                    <Route path="/hospital" element={<MainApp />}></Route>

                    <Route path="/*" element={<PageNotFound />}></Route>
                  </Routes>
                </BrowserRouter>
              </RecetaProvider>
            </PatologiaProvider>
          </UsuarioProvider>
        </EjercicioProvider>
      </InformacionProvider>
    </>
  );
}

export default App;
