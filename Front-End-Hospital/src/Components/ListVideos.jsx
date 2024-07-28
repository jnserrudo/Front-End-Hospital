import { Tabs, Tab, TabList, TabPanel, TabPanels } from "@chakra-ui/react";
import { PlusCircleOutlined } from "@ant-design/icons";

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
            <Tab style={{lineHeight:'14px'}} >{v.nombre}</Tab>
            <Tab style={{width:'100px'}} ><PlusCircleOutlined style={{fontSize:'x-large'}} /></Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <div className="cont_video">
                <ReactPlayer width="100%" height="100%" url={v.url} controls />
              </div>
            </TabPanel>
            <TabPanel  >
              <div className="tabpanel_descripcion">

              {v.descripcion}
              </div>
              </TabPanel>
          </TabPanels>
        </Tabs>
      ))}
    </div>
  );
};
