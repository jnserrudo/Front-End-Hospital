import React from "react";
import { SettingOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Alert } from "antd";
import { AdminPatologia } from "../Components/AdminPatologia";
import { AdminPaciente } from "../Components/AdminPaciente";
import { AdminReceta } from "../Components/AdminReceta";
import { AdminInformacion } from "../Components/AdminInformacion";
import { AdminEjercicio } from "../Components/AdminEjercicio";
import { AdminUsuario } from "../Components/AdminUsuario";
import { AdminCategoria } from "../Components/AdminCategoria";
import { AdminInfografia } from "../Components/AdminInfografia";
import { AdminFAQ } from "../Components/AdminFAQ";
import { AdminCalendario } from "../Components/AdminCalendario";
import { AdminAutoevaluacion } from "../Components/AdminAutoevaluacion";

const PANEL_LABELS = {
  "6": "Patologías",
  "7": "Recetas",
  "8": "Información",
  "9": "Ejercicio",
  "10": "Usuarios",
  "11": "Pacientes",
  "12": "Categorías",
  "19": "Infografías",
  "20": "Preguntas Frecuentes",
  "21": "Calendario de Eventos",
  "22": "Autoevaluaciones",
};

const PANEL_HELP = {
  "6": "Crea, edita y elimina patologías. Usa el botón 'Agregar' para crear nuevas patologías. Haz clic en los iconos de acción para editar o eliminar registros.",
  "7": "Gestiona recetas saludables con ingredientes, preparación e información nutricional. Puedes asociar recetas a categorías y patologías específicas.",
  "8": "Administra videos informativos sobre salud. Sube videos o agrega enlaces externos. Organiza el contenido por categorías y patologías.",
  "9": "Gestiona videos de ejercicios. Sube demostraciones o enlaces externos. Clasifica los ejercicios por categorías y patologías.",
  "10": "Administra usuarios del sistema. Crea cuentas, asigna roles (Admin/Paciente) y gestiona permisos de acceso.",
  "11": "Gestiona pacientes y sus patologías asociadas. Vincula pacientes con sus condiciones médicas para personalizar el contenido.",
  "12": "Administra categorías para organizar recetas, información y ejercicios. Las categorías ayudan a filtrar y clasificar el contenido.",
  "19": "Gestiona infografías sobre dietas y nutrición. Sube archivos PDF o imágenes, o agrega enlaces externos. Organiza por tipo de dieta.",
  "20": "Administra preguntas frecuentes. Crea preguntas y respuestas organizadas por categorías para ayudar a los usuarios.",
  "21": "Gestiona eventos del calendario hospitalario. Crea eventos generales o específicos por patología con fechas, descripciones e imágenes.",
  "22": "Visualiza y realiza el seguimiento clínico de las autoevaluaciones completadas por los pacientes, con alertas clínicas de dolor elevado y síntomas de alarma.",
};

export const PanelAdministracion = ({ selectedKey }) => {
  const label = PANEL_LABELS[selectedKey] || "Administración";

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 48, height: 48, borderRadius: "var(--radius-md)",
            background: "var(--primary-100)", display: "flex",
            alignItems: "center", justifyContent: "center",
            color: "var(--primary)", fontSize: 24,
          }}>
            <SettingOutlined />
          </div>
          <div>
            <h2 className="page-title">Administración — {label}</h2>
            <p className="page-subtitle">Gestión de registros del sistema</p>
          </div>
        </div>
        <div className="page-title-bar" />
      </div>

      {PANEL_HELP[selectedKey] && (
        <Alert
          message="¿Cómo usar esta sección?"
          description={PANEL_HELP[selectedKey]}
          type="info"
          icon={<InfoCircleOutlined />}
          showIcon
          closable
          style={{ marginBottom: 24, borderRadius: "var(--radius-md)" }}
        />
      )}

      <div style={{
        background: "white",
        border: "1px solid var(--gray-200)",
        borderRadius: "var(--radius-lg)",
        padding: "1.5rem",
        boxShadow: "var(--shadow)",
        minHeight: 400,
      }}>
        {selectedKey === "6" && <AdminPatologia />}
        {selectedKey === "7" && <AdminReceta />}
        {selectedKey === "8" && <AdminInformacion />}
        {selectedKey === "9" && <AdminEjercicio />}
        {selectedKey === "10" && <AdminUsuario />}
        {selectedKey === "11" && <AdminPaciente selectedKey={selectedKey} />}
        {selectedKey === "12" && <AdminCategoria />}
        {selectedKey === "19" && <AdminInfografia />}
        {selectedKey === "20" && <AdminFAQ />}
        {selectedKey === "21" && <AdminCalendario />}
        {selectedKey === "22" && <AdminAutoevaluacion />}
      </div>
    </div>
  );
};

{
  /* <Tabs index={tabIndex}  onChange={handleTabsChange} position="relative" variant='enclosed'>
        <TabList className="tablist" >
          <Tab className="txt_tab" >Patologia</Tab>
           <Tab className="txt_tab" >Paciente</Tab> 
          <Tab className="txt_tab" >Recetas</Tab>
          <Tab className="txt_tab" >Informacion</Tab>
          <Tab className="txt_tab" >Ejercicio</Tab>
          <Tab className="txt_tab" >Usuario</Tab>

        </TabList>
       
        <TabPanels>
          <TabPanel>
            <AdminPatologia/>
          </TabPanel>
           <TabPanel>
            <AdminPaciente/>
          </TabPanel> 
          <TabPanel>
            <AdminReceta/>
          </TabPanel>
          <TabPanel>
            <AdminInformacion/>
          </TabPanel>
          <TabPanel>
            <AdminEjercicio/>
          </TabPanel>
          <TabPanel>
            <AdminUsuario/>
          </TabPanel>
        </TabPanels>
      </Tabs> */
}
