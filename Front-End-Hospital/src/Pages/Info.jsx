import React, { useContext, useEffect, useState } from "react";
import { Select, Space } from "antd";
import { ListVideos } from "../Components/ListVideos";
import InformacionContext from "../Contexts/InformacionContext";
import { entorno } from "../services/config";

export const Info = () => {
  //esta vble videos sera reemplazada por un listado de videos que ser iran cargando con sus URLs en la BD
  const [videos, setVideos] = useState([]);
  /* let videos = [
   
    {
      url: "https://www.youtube.com/embed/OwX6e0F2x6s?si=ONEMbfM7-gkYpiGk",
    },
    {
      url: "https://www.youtube.com/embed/OwX6e0F2x6s?si=ONEMbfM7-gkYpiGk",
    },
    {
      url: "https://www.youtube.com/embed/OwX6e0F2x6s?si=ONEMbfM7-gkYpiGk",
    },
    {
      url: "https://www.youtube.com/embed/OwX6e0F2x6s?si=ONEMbfM7-gkYpiGk",
    },
    {
      url: "https://www.youtube.com/embed/OwX6e0F2x6s?si=ONEMbfM7-gkYpiGk",
    },
    {
      url: "https://www.youtube.com/embed/OwX6e0F2x6s?si=ONEMbfM7-gkYpiGk",
    },
  ]; */

  const [options, setOptions] = useState([]);

  const { db } = useContext(InformacionContext);
  console.log(db);

  // Generar opciones de patologías aleatorias
  const generateRandomPatologias = () => {
    const patologias = [];
    const patologiasCount = 20; // Número de patologías a generar

    for (let i = 1; i <= patologiasCount; i++) {
      patologias.push({
        label: `Patología ${i}`,
        value: i,
      });
    }

    setOptions(patologias);
  };
  useEffect(() => {
    generateRandomPatologias();
  }, []);

  useEffect(() => {
    if (db?.length > 0) {
      let videosOfInfo = db.map((videos) => {
        if (videos.urlVideo) {
          return {
            url: entorno.slice(0, -4) + videos.urlVideo,
          };
        }
      });
      console.log(videosOfInfo);
      setVideos(videosOfInfo);
    }
  }, [db]);

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };
  return (
    <div>
      <nav className="nav_recetas">
        <img src="/recetas.svg" alt="" />
        <div className="cont_sel_recetas">
          <b>Informacion Saludable</b>
          {/* <p>Elige Patología</p>
          <Select
            className="select_recetas"
            mode="multiple"
            allowClear
            style={{
              width: "100%",
            }}
            placeholder="Please select"
            defaultValue={["a10", "c12"]}
            onChange={handleChange}
            options={options}
            color
          /> */}
        </div>
      </nav>
      <div className="cont_info">
        <ListVideos videos={videos} />
      </div>
    </div>
  );
};
