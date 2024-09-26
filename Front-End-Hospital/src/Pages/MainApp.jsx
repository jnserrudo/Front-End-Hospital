import React, { useEffect, useState } from "react";
import { Header as CustomHeader } from "../Components/Header"; // Renombramos el componente Header para evitar conflictos
import { Breadcrumb, Layout, Menu, theme } from "antd"; // Importamos los componentes necesarios de Ant Design
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons"; // Importamos los iconos de Ant Design
import toast, { Toaster } from "react-hot-toast";
import { ChakraProvider, extendTheme } from "@chakra-ui/react"; // Importamos ChakraProvider para mantener los estilos de Chakra UI
import { Nav } from "../Components/Nav";
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
  getItem("Inicio", "1", <PieChartOutlined />),
  getItem("Recetas", "2", <DesktopOutlined />),
  getItem("Informarse", "3", <UserOutlined />),
  getItem("Ejercitarse", "4", <TeamOutlined />),
  /* getItem("Administración", "5", <FileOutlined />), */
  getItem("Administración", "5", <FileOutlined />, [
    getItem("Patologia", "6"),
    getItem("Recetas", "7"),
    getItem("Informacion", "8"),
    getItem("Ejercicio", "9"),
    getItem("Usuario", "10"),
    getItem("Categorias", "11"),
  ]),
  getItem("Tablas", "12", <FileOutlined />),
  getItem("Conversor Un.Med.", "13", <FileOutlined />),
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
  const [collapsed, setCollapsed] = useState(true); // Estado para manejar la colapsabilidad del Sider
  const [selectedKey, setSelectedKey] = useState("1"); // Estado para manejar la clave seleccionada del menú
  const [token, setToken] = useState(null); // Estado para almacenar el token JWT
  const [validatedToken, setValidatedToken] = useState(false); // Estado para manejar la validación del token
  const navigate = useNavigate(); // Hook para la navegación

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
  
  // Efecto para validar el token y mostrar un toast de éxito
  useEffect(() => {
    if (token) {
      setValidatedToken(token.exp * 1000 > Date.now());
      toast.success("Logeado con éxito!", { duration: 3000 });
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

  useEffect(()=>{
    setCollapsed(true)
  },[selectedKey])

  return (
    <ChakraProvider theme={customTheme}>
      <Layout style={{ minHeight: "100vh" }}>
        <Toaster position="top-center" reverseOrder={false} />
        {/* Componente para mostrar notificaciones */}
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          /*breakpoint="lg" */
          collapsedWidth="0"
          style={{
            backgroundColor: "#046ba3",
            position: "fixed", // Fija el sider para que no afecte el flujo del documento
            zIndex: 110, // Asegúrate de que el sider esté por encima del contenido
            height: "100vh", // Asegura que el sider cubra toda la altura de la ventana
          }}
        >
          <div className="logo_sidebar" /> {/* Elemento visual para el logo */}
          <Menu
            theme="dark"
            defaultSelectedKeys={["1"]}
            mode="inline"
            style={{
              backgroundColor: "#046ba3",
            }}
            items={items}
            onClick={handleMenuClick}
          />{" "}
          {/* Menú de navegación */}
        </Sider>
        <Layout>
          {/* <Header style={{ margin:'1rem', padding: 0, background: colorBgContainer }}>
          </Header> */}
          <CustomHeader setSelectedKey={setSelectedKey} />{" "}
          {/* Componente de cabecera personalizado */}
          <Content
            style={{ margin: "0 16px", paddingTop: "0rem" }}
            className="content-main"
          >
            {/* <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>App</Breadcrumb.Item>
              <Breadcrumb.Item>{items.find(item => item.key === selectedKey)?.label}</Breadcrumb.Item> 
            </Breadcrumb> */}
            {/* Muestra la sección actual */}
            <div
              style={{
                padding: "0 2px",

                background: colorBgContainer,
                borderRadius: borderRadiusLG,
                color: "black",
              }}
              className="content-container"
            >
              {/*  <Breadcrumb style={{ margin: "16px 0",color:'black' }}>
                <Breadcrumb.Item>App</Breadcrumb.Item>
                <Breadcrumb.Item>
                  {items.find((item) => item.key === selectedKey)?.label}
                </Breadcrumb.Item>
              </Breadcrumb> */}
              <Nav bandLogin={false} bandHospital={true} />
              {/* Componente Nav para manejo de sesión */}
              
              {selectedKey === "1" && (
                <main className="main_home">
                  <img src="/fondo.jpg" className="img_fondo" alt="" />
                  
                  <ListCard
                    setTabIndex={(index) => setSelectedKey(index.toString())}
                  />
                </main>
              )}
              {selectedKey === "2" && <Recetas />}
              {selectedKey === "3" && <Info />}
              {selectedKey === "4" && <Ejercicio />}
              {+selectedKey > 5 && +selectedKey < 12 && localStorage.getItem("rol") != 3 && (
                <PanelAdministracion selectedKey={selectedKey} />
              )}
              {selectedKey === "12"   && <TablasInformativas />}
              {selectedKey === "13"   && <ConversionUnidades/>}
            </div>
            <FooterHospital setSelectedKey={setSelectedKey} />

            {/* <Footer style={{ textAlign: "center" }}>
              <FooterHospital />
            </Footer> */}
          </Content>
        </Layout>
      </Layout>
    </ChakraProvider>
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
                <img src="/fondo.jpg" className="img_fondo" alt="" />

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
