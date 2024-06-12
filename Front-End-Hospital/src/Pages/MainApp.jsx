import React, { useState } from "react";
import { Header } from "../Components/Header";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  TabIndicator,
} from "@chakra-ui/react";

import "../style.css";
import { Nav } from "../Components/Nav";
import { ListCard } from "../Components/ListCard";
import { Ejercicio } from "./Ejercicio";
import { Info } from "./Info";
import { Recetas } from "./Recetas";
import { Administracion } from "./Administracion";
import { PanelAdministracion } from "./PanelAdministracion";


import { ChakraProvider } from "@chakra-ui/react";



export const MainApp = () => {

  const [tabIndex, setTabIndex] = useState(0)


  const handleTabsChange = (index) => {
    setTabIndex(index)
  }

  

  let admin=true

  return (
    <div>
      <Header />

      <Nav bandLogin={false} bandHospital={true} />
      <ChakraProvider>

      <Tabs index={tabIndex}  onChange={handleTabsChange}  position="relative" variant='enclosed'>
        <TabList className="tablist" >
          <Tab className="txt_tab" >Inicio</Tab>
          <Tab className="txt_tab" >Recetas</Tab>
          <Tab className="txt_tab" >Informarse</Tab>
          <Tab className="txt_tab" >Ejercitarse</Tab>
          {admin?<Tab className="txt_tab" >Administración</Tab>:null}

        </TabList>
       {/*  <TabIndicator
          mt="-1.5px"
          height="2px"
          bg="blue.500"
          borderRadius="1px"
        /> */}
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
            {/* {admin?<Administracion />:null} */}
            {admin? <PanelAdministracion/> :null}

          </TabPanel>
        </TabPanels>
      </Tabs>
      </ChakraProvider>
    </div>
  );
};
