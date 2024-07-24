import React, { useContext, useEffect, useState } from "react";
import { Select, Space } from "antd";
import { ListVideos } from "../Components/ListVideos";
import InformacionContext from "../Contexts/InformacionContext";
import { entorno } from "../services/config";
import { getInformacionxPaciente } from "../services/paciente-services";
import { Input, FormControl, FormLabel } from "@chakra-ui/react";
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
  const [videosSearch, setVideosSearch] = useState("");
  const { db, dbSearch, handleSearch } = useContext(InformacionContext);
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

  const getinformacionxpaciente = async (idUsuario) => {
    const infos = await getInformacionxPaciente(idUsuario);
    let videosOfInfo = infos.map((videos) => {
      if (videos.urlVideo) {
        return {
          ...videos,
          url: entorno.slice(0, -4) + videos.urlVideo,
        };
      }
    });
    console.log(videosOfInfo);
    setVideos(videosOfInfo);
  };

  useEffect(() => {
    console.log(db);
    //vamos a traer las pagologias relacionadas con el usuario
    localStorage.getItem("idUsuario");
    console.log(localStorage.getItem("idUsuario"));
    if (localStorage.getItem("rol") == 3) {
      getinformacionxpaciente(localStorage.getItem("idUsuario"));
    } else {
      if (db?.length > 0) {
        let videosOfInfo = db.map((videos) => {
          if (videos.urlVideo) {
            return {
              ...videos,
              url: entorno.slice(0, -4) + videos.urlVideo,
            };
          }
        });
        console.log(videosOfInfo);
        setVideos(videosOfInfo);
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
          <p>Informacion Saludable</p>
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
          <FormControl
            className="cont_input_edit"
            variant="floating"
            id="videosSearch"
          >
            <Input
              className={`input_edit`}
              placeholder=""
              name="videosSearch"
              variant="outlined"
              type="text"
              value={videosSearch}
              onChange={(e) => {
                setVideosSearch(e.target.value);
                handleSearch(e.target.value, videos);
              }}
            />
            <FormLabel>Buscar Videos</FormLabel>
          </FormControl>
        </div>
      </nav>
      <div className="cont_info">
        <ListVideos videos={videosSearch.length>0?dbSearch:videos} />
      </div>
    </div>
  );
};
