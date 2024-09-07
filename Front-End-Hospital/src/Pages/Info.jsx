import React, { useContext, useEffect, useState } from "react";
import { Select, Space } from "antd";
import { ListVideos } from "../Components/ListVideos";
import InformacionContext from "../Contexts/InformacionContext";
import { entorno } from "../services/config";
import { SearchOutlined } from "@ant-design/icons";

import { getInformacionxPaciente } from "../services/paciente-services";
import {
  Input,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { getAllInformacions } from "../services/informacion-services";
export const Info = () => {
  //esta vble videos sera reemplazada por un listado de videos que ser iran cargando con sus URLs en la BD
  const [videos, setVideos] = useState([]);

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
    //const infos = await getInformacionxPaciente(idUsuario); AHORA SE LLAMA A TODOS, SIN IMPORTAR LA PATOLOGIA
    const infos =await getAllInformacions()

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
    //vamos a traer las patologias relacionadas con el usuario
    localStorage.getItem("idUsuario");
    console.log(localStorage.getItem("idUsuario"));
    /* if (localStorage.getItem("rol") == 3) {
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
    } */

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

  }, [db]);

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };
  return (
    <div>
      <nav className="nav_recetas">
        <img className="icon_imagen" src="/recetas.svg" alt="" />
        <div className="cont_sel_recetas">
          <p>Informacion Saludable</p>

          <FormControl
            className="cont_input_edit"
            variant="floating"
            id="videosSearch"
          >
            <InputGroup>
              <Input
                placeholder=""
                name="videosSearch"
                type="text"
                value={videosSearch}
                onChange={(e) => {
                  setVideosSearch(e.target.value);
                  handleSearch(e.target.value, videos);
                }}
              />
              <InputRightElement
                width="4.5rem"
                style={{ color: "#046ba3", fontSize: "20px" }}
              >
                <SearchOutlined />
              </InputRightElement>
            </InputGroup>

            <FormLabel></FormLabel>
          </FormControl>
        </div>
      </nav>
      <div className="cont_info">
        <ListVideos videos={videosSearch.length > 0 ? dbSearch : videos} />
      </div>
    </div>
  );
};
