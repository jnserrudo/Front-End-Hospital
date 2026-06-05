import React from "react";
import { Card } from "./Card";
import {
  CoffeeOutlined,
  ReadOutlined,
  ThunderboltOutlined,
  BarChartOutlined,
  PictureOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

const ICON_STYLE = { fontSize: "42px" };

export const ListCard = ({ setTabIndex }) => {
  return (
    <div className="list_card">
      <Card
        onClick={() => setTabIndex(2)}
        mje="Recetas Saludables"
        desc="Recetas que te ayudan a sentirte mejor"
        logo={<CoffeeOutlined style={ICON_STYLE} />}
      />
      <Card
        onClick={() => setTabIndex(3)}
        mje="Información y Salud"
        desc="Videos y podcasts sobre patologías y tips para cuidarte"
        logo={<ReadOutlined style={ICON_STYLE} />}
      />
      <Card
        onClick={() => setTabIndex(4)}
        mje="Ejercitate con Nosotros"
        desc="Videos para que puedas ejercitarte desde casa"
        logo={<ThunderboltOutlined style={ICON_STYLE} />}
      />
      <Card
        onClick={() => setTabIndex(13)}
        mje="Tablas Nutricionales"
        desc="Información nutricional de alimentos"
        logo={<BarChartOutlined style={ICON_STYLE} />}
      />
      <Card
        onClick={() => setTabIndex(15)}
        mje="Infografías de Dietas"
        desc="Material visual sobre nutrición y planes alimentarios"
        logo={<PictureOutlined style={ICON_STYLE} />}
      />
      <Card
        onClick={() => setTabIndex(17)}
        mje="Preguntas Frecuentes"
        desc="Encontrá respuestas a las dudas más comunes"
        logo={<QuestionCircleOutlined style={ICON_STYLE} />}
      />
    </div>
  );
};
