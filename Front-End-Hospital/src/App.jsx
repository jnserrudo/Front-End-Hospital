import "./App.css";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ConfigProvider } from "antd";
import esES from "antd/locale/es_ES";
import { Home } from "./Pages/Home";
import { PageNotFound } from "./Pages/PageNotFound";
import { MainApp } from "./Pages/MainApp";
import { RestablecerPassword } from "./Pages/RestablecerPassword";
import { PatologiaProvider } from "./Contexts/PatologiaContext";
import { RecetaProvider } from "./Contexts/RecetaContext";
import { InformacionProvider } from "./Contexts/InformacionContext";
import { EjercicioProvider } from "./Contexts/EjercicioContext";
import { CategoriaProvider } from "./Contexts/CategoriaContext";
import { SessionManager } from "./Components/SessionManager";
import { isSessionValid } from "./services/session";

// Las pantallas internas solo se muestran con una sesión válida; los datos se
// piden recién después de iniciar sesión (los providers viven dentro de la ruta protegida).
const RequireSession = ({ children }) => {
  const location = useLocation();
  if (!isSessionValid()) {
    return <Navigate to="/login?motivo=sin-sesion" replace state={{ from: location.pathname }} />;
  }
  return (
    <>
      <SessionManager />
      {children}
    </>
  );
};

const ContentProviders = ({ children }) => (
  <CategoriaProvider>
    <InformacionProvider>
      <EjercicioProvider>
        <PatologiaProvider>
          <RecetaProvider>{children}</RecetaProvider>
        </PatologiaProvider>
      </EjercicioProvider>
    </InformacionProvider>
  </CategoriaProvider>
);

// Tema único de Ant Design, alineado con las variables de style.css (--primary, --success, etc.).
const THEME = {
  token: {
    colorPrimary: "#0369a1",
    colorLink: "#0369a1",
    colorSuccess: "#22c55e",
    colorWarning: "#f59e0b",
    colorError: "#ef4444",
    borderRadius: 8,
  },
};

function App() {
  return (
    <ConfigProvider locale={esES} theme={THEME}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Home />}></Route>
          <Route path="/restablecer-contrasena" element={<RestablecerPassword />}></Route>
          <Route
            path="/hospital"
            element={
              <RequireSession>
                <ContentProviders>
                  <MainApp />
                </ContentProviders>
              </RequireSession>
            }
          ></Route>
          <Route path="/*" element={<PageNotFound />}></Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
