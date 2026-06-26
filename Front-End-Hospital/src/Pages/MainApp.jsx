import React, { useEffect, useState } from "react";
import { Header as CustomHeader } from "../Components/Header"; // Renombramos el componente Header para evitar conflictos
import { Breadcrumb, Layout, Menu, theme } from "antd"; // Importamos los componentes necesarios de Ant Design
import {
  HomeOutlined,
  CoffeeOutlined,
  ReadOutlined,
  ThunderboltOutlined,
  PictureOutlined,
  CalendarOutlined,
  QuestionCircleOutlined,
  MessageOutlined,
  SettingOutlined,
  BarChartOutlined,
  SwapOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import toast from "react-hot-toast";
import { ChakraProvider, extendTheme } from "@chakra-ui/react"; // Importamos ChakraProvider para mantener los estilos de Chakra UI
import { ListCard } from "../Components/ListCard";
import { Ejercicio } from "./Ejercicio";
import { Info } from "./Info";
import { Recetas } from "./Recetas";
import { PanelAdministracion } from "./PanelAdministracion";
import { useNavigate } from "react-router-dom";
import "../style.css"; // Importamos el archivo de estilos correcto
import { FooterHospital } from "../Components/FooterHospital";
import { TablasInformativas } from "../Components/TablasInformativas";
import { ConversionUnidades } from "../Components/ConversionUnidades";
import { FAQ } from "./FAQ";
import { Infografias } from "./Infografias";
import { Calendario } from "./Calendario";
import { FormularioFeedback } from "./FormularioFeedback";
import { FAQProvider } from "../Contexts/FAQContext";
import { CalendarioProvider } from "../Contexts/CalendarioContext";

const { Header, Content, Footer, Sider } = Layout; // Desestructuramos los componentes de Layout de Ant Design

// Función para crear elementos del menú de Ant Design
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

// Definimos los elementos del menú de Ant Design
const items = [
  getItem("Inicio", "1", <HomeOutlined />),
  getItem("Recetas", "2", <CoffeeOutlined />),
  getItem("Informarse", "3", <ReadOutlined />),
  getItem("Ejercitarse", "4", <ThunderboltOutlined />),
  getItem("Infografías", "15", <PictureOutlined />),
  getItem("Calendario", "16", <CalendarOutlined />),
  getItem("FAQ", "17", <QuestionCircleOutlined />),
  getItem("Feedback", "18", <MessageOutlined />),
  getItem("Administración", "5", <SettingOutlined />, [
    getItem("Patologia", "6"),
    getItem("Recetas", "7"),
    getItem("Informacion", "8"),
    getItem("Ejercicio", "9"),
    getItem("Usuario", "10"),
    getItem("Paciente", "11"),
    getItem("Categorias", "12"),
    getItem("Infografías", "19"),
    getItem("FAQ", "20"),
    getItem("Calendario", "21"),
    getItem("Autoevaluaciones", "22"),
  ]),
  getItem("Tablas", "13", <BarChartOutlined />),
  getItem("Conversor Un.Med.", "14", <SwapOutlined />),
];

// Estilos activos personalizados para Chakra UI
const activeLabelStyles = {
  transform: "scale(0.85) translateY(-24px)",
};

// Extendemos el tema de Chakra UI para incluir los estilos personalizados
const customTheme = extendTheme({
  components: {
    Form: {
      variants: {
        floating: {
          container: {
            _focusWithin: {
              label: {
                ...activeLabelStyles,
              },
            },
            "input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) ~ label":
              {
                ...activeLabelStyles,
              },
            label: {
              top: 0,
              left: 0,
              zIndex: 2,
              position: "absolute",
              backgroundColor: "white",
              pointerEvents: "none",
              mx: 3,
              px: 1,
              my: 2,
              transformOrigin: "left top",
            },
          },
        },
      },
    },
  },
});

export const MainApp = () => {
  const [collapsed, setCollapsed] = useState(window.innerWidth <= 768); // Estado para manejar la colapsabilidad del Sider
  const [selectedKey, setSelectedKey] = useState("1"); // Estado para manejar la clave seleccionada del menú
  const [token, setToken] = useState(null); // Estado para almacenar el token JWT
  const [validatedToken, setValidatedToken] = useState(false); // Estado para manejar la validación del token
  const navigate = useNavigate(); // Hook para la navegación

  // Agregar clase al body cuando el sidebar está abierto
  useEffect(() => {
    if (!collapsed) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
  }, [collapsed]);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken(); // Usamos el tema de Ant Design para obtener tokens de estilo

  // Manejador de clics del menú para actualizar la clave seleccionada
  const handleMenuClick = (e) => {
    setSelectedKey(e.key);
  };

  // Función para parsear el token JWT
  const parseJwt = (token) => {
    if (!token) return null;
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split("")
          .map((c) => {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Failed to parse token", error);
      return null;
    }
  };

  // Efecto para obtener el token del local storage y parsearlo
  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("token");
    const parsedToken = parseJwt(tokenFromStorage);
    setToken(parsedToken);
  }, []);

  
 
  useEffect(() => {
    const handlePopState = (event) => {
      console.log('Evento popstate detectado', event,window.location.pathname);
      if (window.location.pathname === '/hospital') {
        setSelectedKey('1')
        //navigate('/hospital'); // Redirige a la ruta deseada
      }
    };

    window.history.pushState(null, '', window.location.href); // Forza una entrada en el historial
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);
  
  // Efecto para validar el token
  useEffect(() => {
    if (token) {
      setValidatedToken(token.exp * 1000 > Date.now());
    }
  }, [token]);

  // Efecto para manejar la redirección si el token no es válido
  useEffect(() => {
    if (token) {
      const isValid = token.exp * 1000 > Date.now();
      setValidatedToken(isValid);

      if (!isValid) {
        navigate("/");
        console.log('al login por invalido')
      } else {
        const timeoutId = setTimeout(() => {
          navigate("/");
          console.log('al login por timeoutid')
        }, token.exp * 1000 - Date.now());

        return () => clearTimeout(timeoutId);
      }
    }
  }, [token, navigate]);

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setCollapsed(true);
    }
  }, [selectedKey]);

  return (
    <FAQProvider>
      <CalendarioProvider>
        <ChakraProvider theme={customTheme}>
          <Layout style={{ minHeight: "100vh" }}>
            {/* Componente para mostrar notificaciones */}
            <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          collapsedWidth="0"
          trigger={null}
          style={{
            background: "linear-gradient(180deg, #075985 0%, #0369a1 50%, #0284c7 100%)",
            position: "fixed",
            zIndex: 110,
            height: "100vh",
            boxShadow: "4px 0 20px rgba(0,0,0,0.15)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div style={{
            padding: "16px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexShrink: 0,
          }}>
            <img src="/logoOñativia.png" alt="" style={{ width: 32, height: 32, objectFit: "contain" }} onError={(e) => e.target.style.display = 'none'} />
            <span style={{ color: "white", fontWeight: 700, fontSize: 14, letterSpacing: "0.02em" }}>
              Oñativia
            </span>
          </div>
          <Menu
            theme="dark"
            defaultSelectedKeys={["1"]}
            mode="inline"
            style={{
              background: "transparent",
              border: "none",
              marginTop: 8,
              flex: 1,
              overflowY: "auto",
              overflowX: "hidden",
            }}
            items={items}
            onClick={handleMenuClick}
          />
          {/* Botón para colapsar en la parte inferior */}
          <div style={{
            padding: "16px 20px",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexShrink: 0,
            background: "rgba(0,0,0,0.1)",
          }}>
            <button
              onClick={() => setCollapsed(true)}
              style={{
                width: "100%",
                padding: "10px 16px",
                background: "rgba(255, 255, 255, 0.15)",
                border: "none",
                borderRadius: "var(--radius-md)",
                color: "white",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
              }}
            >
              <MenuFoldOutlined />
              <span>Cerrar menú</span>
            </button>
          </div>
        </Sider>

        {/* Overlay for mobile when sidebar is open */}
        {!collapsed && (
          <div 
            className="mobile-sidebar-overlay"
            onClick={() => setCollapsed(true)}
          />
        )}
        <Layout className="main-layout">
          {/* <Header style={{ margin:'1rem', padding: 0, background: colorBgContainer }}>
          </Header> */}
          <CustomHeader 
            setSelectedKey={setSelectedKey} 
            collapsed={collapsed} 
            setCollapsed={setCollapsed} 
          />{" "}
          <Content
            className="content-main"
          >
            {/* <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>App</Breadcrumb.Item>
              <Breadcrumb.Item>{items.find(item => item.key === selectedKey)?.label}</Breadcrumb.Item> 
            </Breadcrumb> */}
            {/* Muestra la sección actual */}
            <div
              style={{
                background: selectedKey === "1" ? "transparent" : colorBgContainer,
                color: "black",
              }}
              className={`content-container ${selectedKey !== "1" ? "content-page-padding" : ""}`}
            >
              {selectedKey === "1" ? (
                <main className="main_home">
                  <img src="/fondo.jpg" className="img_fondo" alt="" onError={(e) => e.target.style.display = 'none'} />
                  <ListCard
                    setTabIndex={(index) => setSelectedKey(index.toString())}
                  />
                </main>
              ) : null}
              {selectedKey === "2" && <Recetas setSelectedKey={setSelectedKey} />}
              {selectedKey === "3" && <Info setSelectedKey={setSelectedKey} />}
              {selectedKey === "4" && <Ejercicio setSelectedKey={setSelectedKey} />}
              {selectedKey === "15" && <Infografias setSelectedKey={setSelectedKey} />}
              {selectedKey === "16" && <Calendario setSelectedKey={setSelectedKey} />}
              {selectedKey === "17" && <FAQ setSelectedKey={setSelectedKey} />}
              {selectedKey === "18" && <FormularioFeedback />}
              {+selectedKey >= 6 && +selectedKey <= 22 && selectedKey !== "13" && selectedKey !== "14" && selectedKey !== "15" && selectedKey !== "16" && selectedKey !== "17" && selectedKey !== "18" && localStorage.getItem("rol") != 3 && (
                <PanelAdministracion key={selectedKey} selectedKey={selectedKey} />
              )}
              {selectedKey === "13"   && <TablasInformativas />}
              {selectedKey === "14"   && <ConversionUnidades/>}
            </div>
            <FooterHospital setSelectedKey={setSelectedKey} />

            {/* <Footer style={{ textAlign: "center" }}>
              <FooterHospital />
            </Footer> */}
          </Content>
        </Layout>
      </Layout>
    </ChakraProvider>
      </CalendarioProvider>
    </FAQProvider>
  );
};

/* import React, { useEffect, useState } from "react";
import { Header } from "../Components/Header";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  TabIndicator,
  extendTheme
} from "@chakra-ui/react";
import toast, { Toaster } from "react-hot-toast";

import "../style.css";
import { Nav } from "../Components/Nav";
import { ListCard } from "../Components/ListCard";
import { Ejercicio } from "./Ejercicio";
import { Info } from "./Info";
import { Recetas } from "./Recetas";
import { Administracion } from "./Administracion";
import { PanelAdministracion } from "./PanelAdministracion";

import { ChakraProvider } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";



const activeLabelStyles = {
  transform: "scale(0.85) translateY(-24px)",
};

export const theme = extendTheme({
  components: {
    Form: {
      variants: {
        floating: {
          container: {
            _focusWithin: {
              label: {
                ...activeLabelStyles,
              },
            },
            "input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) ~ label": {
              ...activeLabelStyles,
            },
            label: {
              top: 0,
              left: 0,
              zIndex: 2,
              position: "absolute",
              backgroundColor: "white",
              pointerEvents: "none",
              mx: 3,
              px: 1,
              my: 2,
              transformOrigin: "left top",
            },
          },
        },
      },
    },
  },
});


export const MainApp = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [token, setToken] = useState(null)
  const [validatedToken, setValidatedToken] = useState(false)

  const navigate = useNavigate()
  const handleTabsChange = (index) => {
    setTabIndex(index);
  };

  //buscar siempre en local storage el jwt token, si no esta okey o no esta, manda de nuevo al login
  const parseJwt = (token) => {
    if (!token) return null;
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split("")
          .map((c) => {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Failed to parse token", error);
      return null;
    }
  };


  useEffect(() => {
    const tokenFromStorage = localStorage.getItem('token');
    const parsedToken = parseJwt(tokenFromStorage);
    setToken(parsedToken);
    
  }, []);

  useEffect(()=>{
    
    if(token){
      setValidatedToken(token.exp*1000>Date.now())
      toast.success('Logeado con exito!',{
        duration: 3000,
      })
    }
  },[token])


  
  useEffect(() => {
    if (token) {
      const isValid = token.exp * 1000 > Date.now();
      setValidatedToken(isValid);

      if (!isValid) {
        navigate('/');
      } else {
        // Set a timeout to automatically navigate to '/' when the token expires
        const timeoutId = setTimeout(() => {
          navigate('/');
        }, token.exp * 1000 - Date.now());

        return () => clearTimeout(timeoutId); // Cleanup on unmount
      }
    }
  }, [token, navigate]);
  let admin = true;
  return (
    <div>
            <Toaster position="top-center" reverseOrder={false} />

      <Header />

      <Nav bandLogin={false} bandHospital={true} />
      <ChakraProvider theme={theme} >
        <Tabs
          index={tabIndex}
          onChange={handleTabsChange}
          position="relative"
          variant="enclosed"
        >
          <TabList className="tablist">
            <Tab className="txt_tab">Inicio</Tab>
            <Tab className="txt_tab">Recetas</Tab>
            <Tab className="txt_tab">Informarse</Tab>
            <Tab className="txt_tab">Ejercitarse</Tab>
            {admin ? <Tab className="txt_tab">Administración</Tab> : null}
          </TabList>
          
          <TabPanels>
            <TabPanel>
              <main className="main_home">
                <img src="/fondo.jpg" className="img_fondo" alt="" onError={(e) => e.target.style.display = 'none'} />

                <ListCard setTabIndex={setTabIndex} />
              </main>
            </TabPanel>
            <TabPanel>
              <Recetas />
            </TabPanel>
            <TabPanel>
              <Info />
            </TabPanel>
            <TabPanel>
              <Ejercicio />
            </TabPanel>
            <TabPanel>
              {localStorage.getItem("rol") != 3 ? <PanelAdministracion /> : null}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </ChakraProvider>
    </div>
  );
};
 */
