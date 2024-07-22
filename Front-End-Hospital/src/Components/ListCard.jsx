import React from "react";
import { Card } from "./Card";
import {
  FileDoneOutlined,
  ReadOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";
export const ListCard = ({setTabIndex}) => {
  return (
    <div className="list_card">
      {/* recetas */}
      {/* videos/informes */}
      {/* para ejercicio */}

      <Card
        onClick={()=>setTabIndex(2)}
        mje={`Recetas que te ayudan a 
sentirte mejor`}
        logo={<FileDoneOutlined style={{ fontSize: "80px" }} />}
      />
      <Card
              onClick={()=>setTabIndex(3)}

        mje={`Videos y podcast para que 
aprendas sobre las diferentes 
patología y tips para cuidarte`}
        logo={<ReadOutlined style={{ fontSize: "80px" }} />}
      />
      <Card
              onClick={()=>setTabIndex(4)}

        mje={`Videos para que puedas 
ejercitarte`}
        logo={<ScheduleOutlined style={{ fontSize: "80px" }} />}
      />
    </div>
  );
};
