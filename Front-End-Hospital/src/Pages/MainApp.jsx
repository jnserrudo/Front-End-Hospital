import React, { useEffect, useState } from "react";
import { Header as CustomHeader } from "../Components/Header"; // Renombramos el componente Header para evitar conflictos
import { Layout, Menu, theme } from "antd";
import {
  HomeOutlined,
  CalendarOutlined,
  MessageOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  UserOutlined,
  TagsOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import { ChakraProvider, extendTheme } from "@chakra-ui/react"; // Importamos ChakraProvider para mantener los estilos de Chakra UI
import { ListCard } from "../Components/ListCard";
import { HospitalIcon } from "../Components/HospitalIcon";
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
import { getRol, ROLES } from "../services/session";

const { Content, Sider } = Layout;

// Función para crear elementos del menú de Ant Design
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const menuIcon = (name) => (
  <HospitalIcon name={name} size={20} className="sider-menu-icon" />
);

// Secciones de Administración y qué roles pueden verlas (el backend aplica los mismos permisos).
const ADMIN_ITEMS = [
  { key: "6", label: "Patologías", icon: menuIcon("patolDiabetes"), roles: [ROLES.ADMIN] },
  { key: "7", label: "Recetas", icon: menuIcon("recetas"), roles: [ROLES.ADMIN, ROLES.PROFESIONAL] },
  { key: "8", label: "Información", icon: menuIcon("infoPrueba"), roles: [ROLES.ADMIN, ROLES.PROFESIONAL] },
  { key: "9", label: "Ejercicios", icon: menuIcon("rutinas"), roles: [ROLES.ADMIN, ROLES.PROFESIONAL] },
  { key: "10", label: "Usuarios", icon: <UserOutlined />, roles: [ROLES.ADMIN] },
  { key: "11", label: "Pacientes", icon: menuIcon("fichaSalud"), roles: [ROLES.ADMIN, ROLES.PROFESIONAL] },
  { key: "12", label: "Categorías", icon: <TagsOutlined />, roles: [ROLES.ADMIN] },
  { key: "19", label: "Infografías", icon: menuIcon("platoNutricion"), roles: [ROLES.ADMIN, ROLES.PROFESIONAL] },
  { key: "20", label: "Preguntas frecuentes", icon: menuIcon("informacion"), roles: [ROLES.ADMIN, ROLES.PROFESIONAL] },
  { key: "21", label: "Calendario", icon: <CalendarOutlined />, roles: [ROLES.ADMIN, ROLES.PROFESIONAL] },
  { key: "22", label: "Autoevaluaciones", icon: menuIcon("fichaSalud"), roles: [ROLES.ADMIN, ROLES.PROFESIONAL] },
  { key: "23", label: "Comentarios", icon: <CommentOutlined />, roles: [ROLES.ADMIN] },
];

export const adminKeysForRol = (rol) => ADMIN_ITEMS.filter((i) => i.roles.includes(rol)).map((i) => i.key);

// El menú se arma según el rol: el paciente no ve Administración.
const buildItems = (rol) => {
  const adminChildren = ADMIN_ITEMS.filter((i) => i.roles.includes(rol)).map((i) => getItem(i.label, i.key, i.icon));
  return [
    getItem("Inicio", "1", <HomeOutlined />),
    getItem("Recetas", "2", menuIcon("recetas")),
    getItem("Informarse", "3", menuIcon("consultaMedica")),
    getItem("Ejercitarse", "4", menuIcon("videosEjercicio")),
    getItem("Infografías", "15", menuIcon("platoNutricion")),
    getItem("Calendario", "16", <CalendarOutlined />),
    getItem("Preguntas frecuentes", "17", menuIcon("informacion")),
    getItem("Feedback", "18", <MessageOutlined />),
    ...(adminChildren.length > 0 ? [getItem("Administración", "5", <SettingOutlined />, adminChildren)] : []),
    getItem("Tablas nutricionales", "13", menuIcon("tablasInfo")),
    getItem("Conversor de unidades", "14", menuIcon("conversor")),
  ];
};


// Tema de Chakra UI (formularios heredados): mismo azul que el resto de la app
// para que «Guardar» / «Editar» se vean igual que los botones de Ant Design.
const customTheme = extendTheme({
  colors: {
    blue: {
      50: "#f0f9ff",
      100: "#e0f2fe",
      200: "#bae6fd",
      300: "#7dd3fc",
      400: "#38bdf8",
      500: "#0369a1",
      600: "#075985",
      700: "#0c4a6e",
      800: "#0c4a6e",
      900: "#082f49",
    },
  },
  components: {
    // Variante «floating» de los formularios heredados: la etiqueta va arriba del campo,
    // sin fondo ni posición absoluta, para que nunca tape lo que está encima.
    Form: {
      variants: {
        floating: {
          container: {
            display: "flex",
            flexDirection: "column",
            label: {
              order: -1,
              position: "static",
              transform: "none",
              backgroundColor: "transparent",
              pointerEvents: "auto",
              m: 0,
              mb: "6px",
              px: 0,
              fontSize: "sm",
              fontWeight: 600,
              color: "gray.700",
            },
          },
        },
      },
    },
  },
});

export const MainApp = () => {
  const [collapsed, setCollapsed] = useState(window.innerWidth < 992); // Estado para manejar la colapsabilidad del Sider
  const [selectedKey, setSelectedKey] = useState("1"); // Sección visible (el menú la refleja)
  const [openKeys, setOpenKeys] = useState([]); // Submenús abiertos (Administración)
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
    token: { colorBgContainer },
  } = theme.useToken(); // Usamos el tema de Ant Design para obtener tokens de estilo

  // Manejador de clics del menú para actualizar la clave seleccionada
  const handleMenuClick = (e) => {
    setSelectedKey(e.key);
    // En celular y tablet el menú se cierra al tocar cualquier opción (también la actual).
    if (window.innerWidth < 992) setCollapsed(true);
  };

  const rol = getRol();
  const items = buildItems(rol);
  const allowedAdminKeys = adminKeysForRol(rol);

  useEffect(() => {
    const handlePopState = (event) => {
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
  
  useEffect(() => {
    // En celular y tablet el menú se cierra solo al elegir una sección.
    if (window.innerWidth < 992) {
      setCollapsed(true);
    }
    // Si se entra a una sección de Administración (p. ej. con «Administrar»), abrimos ese submenú.
    if (allowedAdminKeys.includes(selectedKey)) {
      setOpenKeys((k) => (k.includes("5") ? k : [...k, "5"]));
    }
    window.scrollTo({ top: 0 });
  }, [selectedKey]);

  // Colapsar sider al pasar a móvil / al rotar dispositivo
  useEffect(() => {
    const MOBILE_MAX = 991;
    const onResize = () => {
      if (window.innerWidth <= MOBILE_MAX) {
        setCollapsed(true);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

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
          breakpoint="lg"
          onBreakpoint={(broken) => {
            if (broken) setCollapsed(true);
          }}
          style={{
            background: "linear-gradient(180deg, #075985 0%, #0369a1 50%, #0284c7 100%)",
            position: "fixed",
            zIndex: 110,
            height: "100%",
            maxHeight: "100dvh",
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
            <img src="/logo-onativia.png" alt="" style={{ width: 32, height: 32, objectFit: "contain" }} onError={(e) => { e.currentTarget.style.display = "none"; }} />
            <span style={{ color: "white", fontWeight: 700, fontSize: 13, letterSpacing: "0.02em", lineHeight: 1.2 }}>
              Hospital Dr. Arturo Oñativia
            </span>
          </div>
          <Menu
            theme="dark"
            selectedKeys={[selectedKey]}
            openKeys={openKeys}
            onOpenChange={setOpenKeys}
            mode="inline"
            className="sider-menu"
            style={{
              background: "transparent",
              border: "none",
              marginTop: 8,
            }}
            items={items}
            onClick={handleMenuClick}
          />
          <button
            type="button"
            className="sider-close-btn"
            onClick={() => setCollapsed(true)}
            aria-label="Cerrar menú"
          >
            <MenuFoldOutlined />
            <span>Cerrar menú</span>
          </button>
        </Sider>

        {/* Overlay for mobile when sidebar is open */}
        {!collapsed && (
          <div 
            className="mobile-sidebar-overlay"
            onClick={() => setCollapsed(true)}
          />
        )}
        <Layout className="main-layout">
          <CustomHeader 
            setSelectedKey={setSelectedKey} 
            collapsed={collapsed} 
            setCollapsed={setCollapsed} 
          />{" "}
          <Content
            className={`content-main ${selectedKey === "1" ? "content-main--home" : ""}`}
          >
            {/* Muestra la sección actual */}
            <div
              style={{
                background: selectedKey === "1" ? "transparent" : colorBgContainer,
                color: "black",
              }}
              className={`content-container ${selectedKey === "1" ? "content-container--home" : "content-page-padding"}`}
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
              {selectedKey === "18" && <FormularioFeedback setSelectedKey={setSelectedKey} />}
              {allowedAdminKeys.includes(selectedKey) && (
                <PanelAdministracion key={selectedKey} selectedKey={selectedKey} />
              )}
              {selectedKey === "13"   && <TablasInformativas />}
              {selectedKey === "14"   && <ConversionUnidades/>}
            </div>
            <FooterHospital setSelectedKey={setSelectedKey} isHome={selectedKey === "1"} />
          </Content>
        </Layout>
      </Layout>
    </ChakraProvider>
      </CalendarioProvider>
    </FAQProvider>
  );
};
