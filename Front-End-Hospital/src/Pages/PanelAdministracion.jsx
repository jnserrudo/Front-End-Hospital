import React, { useState } from 'react'
import {
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    TabIndicator,
  } from "@chakra-ui/react";
import { AdminPatologia } from '../Components/AdminPatologia';
import { AdminPaciente } from '../Components/AdminPaciente';
import { AdminReceta } from '../Components/AdminReceta';
import { AdminInformacion } from '../Components/AdminInformacion';
import { AdminEjercicio } from '../Components/AdminEjercicio';
export const PanelAdministracion = () => {
    const [tabIndex, setTabIndex] = useState(0)


  const handleTabsChange = (index) => {
    setTabIndex(index)
  }
  return (
    <Tabs index={tabIndex}  onChange={handleTabsChange} position="relative" variant='enclosed'>
        <TabList className="tablist" >
          <Tab className="txt_tab" >Patologia</Tab>
          <Tab className="txt_tab" >Paciente</Tab>
          <Tab className="txt_tab" >Recetas</Tab>
          <Tab className="txt_tab" >Informacion</Tab>
          <Tab className="txt_tab" >Ejercicio</Tab>

        </TabList>
       {/*  <TabIndicator
          mt="-1.5px"
          height="2px"
          bg="blue.500"
          borderRadius="1px"
        /> */}
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
        </TabPanels>
      </Tabs>
  )
}
