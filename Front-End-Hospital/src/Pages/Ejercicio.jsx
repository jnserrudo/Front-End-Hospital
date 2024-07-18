import React, { useContext, useEffect, useState } from "react";
import { Select, Space } from "antd";
import { ListVideos } from "../Components/ListVideos";
import EjercicioContext from "../Contexts/EjercicioContext";
import { entorno } from "../services/config";
import { getEjercicioxPaciente } from "../services/paciente-services";

export const Ejercicio = () => {
  /* let videos = [
    {
      url: "https://www.youtube.com/embed/9V_HpS9p4QY?si=Y39GmSEWvgUGROZ8",
    },
    {
      url: "https://www.youtube.com/embed/9V_HpS9p4QY?si=Y39GmSEWvgUGROZ8",
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
    {
      url: "https://www.youtube.com/embed/OwX6e0F2x6s?si=ONEMbfM7-gkYpiGk",
    },
  ]; */
  const [videos, setVideos] = useState([]);

  const [options, setOptions] = useState([]);
  const { db } = useContext(EjercicioContext);
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

  const getejerciciosxpaciente=async(idUsuario)=>{
    
    const ejercicios=await getEjercicioxPaciente(idUsuario)
    console.log(ejercicios)
    let videosOfEjercicio = ejercicios.map((videos) => {
      if (videos.urlVideo) {
        return {
          url: entorno.slice(0, -4) + videos.urlVideo,
        };
      }
    });
    console.log(videosOfEjercicio);
    setVideos(videosOfEjercicio);
  }

  useEffect(() => {
    console.log(db)
    //vamos a traer las pagologias relacionadas con el usuario
    localStorage.getItem('idUsuario')
    console.log(localStorage.getItem('idUsuario'))
    if(localStorage.getItem('rol')==3){
      getejerciciosxpaciente(localStorage.getItem('idUsuario'))
    }else{
      if (db?.length > 0) {
        let videosOfEjercicio = db.map((videos) => {
          if (videos.urlVideo) {
            return {
              url: entorno.slice(0, -4) + videos.urlVideo,
            };
          }
        });
        console.log(videosOfEjercicio);
        setVideos(videosOfEjercicio);
      }
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
        <b>Ejercicios Saludables</b>
       {/*  <p>Elige Patología</p>
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
      <div className="cont_ejercicio">
        <ListVideos videos={videos} />
      </div>
    </div>
  );
};
