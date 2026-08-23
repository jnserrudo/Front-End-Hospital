import React from "react";
import { Card } from "./Card";
import { HospitalIcon } from "./HospitalIcon";

export const ListCard = ({ setTabIndex }) => {
  return (
    <div className="list_card">
      <Card
        onClick={() => setTabIndex(2)}
        mje="Recetas Saludables"
        desc="Recetas que te ayudan a sentirte mejor"
        logo={<HospitalIcon name="recetas" size={48} alt="Recetas" />}
      />
      <Card
        onClick={() => setTabIndex(3)}
        mje="Información y Salud"
        desc="Videos y podcasts sobre patologías y tips para cuidarte"
        logo={<HospitalIcon name="consultaMedica" size={48} alt="Información" />}
      />
      <Card
        onClick={() => setTabIndex(4)}
        mje="Ejercitate con Nosotros"
        desc="Videos para que puedas ejercitarte desde casa"
        logo={<HospitalIcon name="videosEjercicio" size={48} alt="Ejercicios" />}
      />
      <Card
        onClick={() => setTabIndex(13)}
        mje="Tablas Nutricionales"
        desc="Información nutricional de alimentos"
        logo={<HospitalIcon name="tablasInfo" size={48} alt="Tablas" />}
      />
      <Card
        onClick={() => setTabIndex(15)}
        mje="Infografías de Dietas"
        desc="Material visual sobre nutrición y planes alimentarios"
        logo={<HospitalIcon name="platoNutricion" size={48} alt="Infografías" />}
      />
      <Card
        onClick={() => setTabIndex(17)}
        mje="Preguntas Frecuentes"
        desc="Encontrá respuestas a las dudas más comunes"
        logo={<HospitalIcon name="informacion" size={48} alt="FAQ" />}
      />
    </div>
  );
};
