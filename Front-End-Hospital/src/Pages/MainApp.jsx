import React, { useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";

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
      <Header />

      <Nav bandLogin={false} bandHospital={true} />
      <ChakraProvider>
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
              {admin ? <PanelAdministracion /> : null}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </ChakraProvider>
    </div>
  );
};
