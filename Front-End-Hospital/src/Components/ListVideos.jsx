import { Tabs, Tab, TabList, TabPanel, TabPanels } from "@chakra-ui/react";

import React from "react";
import ReactPlayer from "react-player";

export const ListVideos = ({ videos }) => {
  //esta lista servira para los videos de informacion y ejercicios
  console.log(videos);
  return (
    <div className="cont_videos">
      {videos.map((v, index) => (
        <Tabs className="tabs_videos" key={index}>
          <TabList>
            <Tab>{v.nombre}</Tab>
            <Tab>Descripción</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <div className="cont_video">
                <ReactPlayer width="100%" height="100%" url={v.url} controls />
              </div>
            </TabPanel>
            <TabPanel>{v.descripcion}</TabPanel>
          </TabPanels>
        </Tabs>
      ))}
    </div>
  );
};
