import React, { useState } from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  TabIndicator,
} from "@chakra-ui/react";
import { AdminPatologia } from "../Components/AdminPatologia";
import { AdminPaciente } from "../Components/AdminPaciente";
import { AdminReceta } from "../Components/AdminReceta";
import { AdminInformacion } from "../Components/AdminInformacion";
import { AdminEjercicio } from "../Components/AdminEjercicio";
import { AdminUsuario } from "../Components/AdminUsuario";
import { AdminCategoria } from "../Components/AdminCategoria";
export const PanelAdministracion = ({ selectedKey,key }) => {
  console.log("selectedKey: ",selectedKey)
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabsChange = (index) => {
    setTabIndex(index);
  };
  return (
    <>
    
      <div
        style={{
          padding: 24,
          minHeight: 360,
          background: "#fff",
          borderRadius: "4px",
        }}
      >
        {selectedKey === "6" && <AdminPatologia />}
        {selectedKey === "7" && <AdminReceta />}
        {selectedKey === "8" && <AdminInformacion />}
        {selectedKey === "9" && <AdminEjercicio />}
        {selectedKey === "10" && <AdminUsuario />}
        {selectedKey === "11" && <AdminPaciente selectedKey={key} />}
        {selectedKey === "12" && <AdminCategoria/>  }

      </div>
    </>
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
