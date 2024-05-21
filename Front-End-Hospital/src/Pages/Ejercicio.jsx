import React, { useEffect, useState } from "react";
import { Select, Space } from "antd";
import { ListVideos } from "../Components/ListVideos";

export const Ejercicio = () => {
  let videos = [
    {
      url: "https://www.youtube.com/watch?v=9V_HpS9p4QY",
    },
    {
      url: "https://www.youtube.com/watch?v=9V_HpS9p4QY",
    },
    {
      url: "https://www.youtube.com/watch?v=9V_HpS9p4QY",
    },
    {
      url: "https://www.youtube.com/watch?v=9V_HpS9p4QY",
    },
    {
      url: "https://www.youtube.com/watch?v=9V_HpS9p4QY",
    },
    {
      url: "https://www.youtube.com/watch?v=9V_HpS9p4QY",
    },
    {
      url: "https://www.youtube.com/watch?v=9V_HpS9p4QY",
    },
    {
      url: "https://www.youtube.com/watch?v=9V_HpS9p4QY",
    },
    {
      url: "https://www.youtube.com/watch?v=9V_HpS9p4QY",
    },
  ];

  const [options, setOptions] = useState([]);

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

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };
  return (
    <div>
      <nav className="nav_recetas">
        <img src="../../public/recetas.svg" alt="" />
        <div className="cont_sel_recetas">
          <p>Recetas Saludables</p>
          <b>Elige Patología</b>
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
          />
        </div>
      </nav>
      <div className="cont_ejercicio">
        <ListVideos videos={videos} />
      </div>
    </div>
  );
};
