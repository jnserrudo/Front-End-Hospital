import React, { useContext, useEffect, useState } from "react";
import { Select, Space } from "antd";
import { ListVideos } from "../Components/ListVideos";
import EjercicioContext from "../Contexts/EjercicioContext";
import { entorno } from "../services/config";
import { getEjercicioxPaciente } from "../services/paciente-services";
import {
  Input,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { SearchOutlined } from "@ant-design/icons";
import { getAllEjercicios } from "../services/ejercicio-services";

export const Ejercicio = () => {
  const [videos, setVideos] = useState([]);

  const [options, setOptions] = useState([]);
  const [videosSearch, setVideosSearch] = useState("");

  const {
    db,
    dbSearch,
    handleSearch,
    patologiasxEjercicioAdd,
    categoriasxEjercicioAdd,
    handleChangeSelectEjercicioFiltrar,
    handleChangeSelectCategoriasFiltrar,
  } = useContext(EjercicioContext);
  console.log(db);

  const sharedProps = {
    mode: "multiple",
    style: {
      width: "100%",
    },
    options: patologiasxEjercicioAdd,
    placeholder: "Seleccione una Patología",
    maxTagCount: "responsive",
  };

  const sharedPropsCategorias = {
    mode: "multiple",
    style: {
      width: "100%",
    },
    options: categoriasxEjercicioAdd,
    placeholder: "Seleccione una Categoría",
    maxTagCount: "responsive",
  };

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

  const getejerciciosxpaciente = async (idUsuario) => {
    //const ejercicios = await getEjercicioxPaciente(idUsuario); AHORA SE LLAMA A TODOS, SIN IMPORTAR LA PATOLOGIA

    const ejercicios = await getAllEjercicios();

    console.log(ejercicios);
    let videosOfEjercicio = ejercicios.map((videos) => {
      if (videos.urlVideo) {
        return {
          ...videos,
          url: entorno.slice(0, -4) + videos.urlVideo,
        };
      }
    });
    console.log(videosOfEjercicio);
    setVideos(videosOfEjercicio);
  };

  useEffect(() => {
    console.log(db);
    //vamos a traer las pagologias relacionadas con el usuario
    localStorage.getItem("idUsuario");
    console.log(localStorage.getItem("idUsuario"));
    /* if (localStorage.getItem("rol") == 3) {
      getejerciciosxpaciente(localStorage.getItem("idUsuario"));
    } else {
      if (db?.length > 0) {
        let videosOfEjercicio = db.map((videos) => {
          if (videos.urlVideo) {
            return {
              ...videos,
              url: entorno.slice(0, -4) + videos.urlVideo,
            };
          }
        });
        console.log(videosOfEjercicio);
        setVideos(videosOfEjercicio);
      }
    } */

    if (db?.length > 0) {
      let videosOfEjercicio = db.map((videos) => {
        if (videos.urlVideo) {
          return {
            ...videos,
            url: entorno.slice(0, -4) + videos.urlVideo,
          };
        }
      });
      console.log(videosOfEjercicio);
      setVideos(videosOfEjercicio);
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
          <p>Ejercicios Saludables</p>

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

          {/* SELECT DE LAS PATOLOGIAS */}
          {/* <Select
            className="select_recetas input_edit"
            name="idPatologias"
            {...sharedProps}
            onChange={handleChangeSelectEjercicioFiltrar}
          /> */}

          {/* SELECT DE LAS CATEGORIAS */}
          <Select
            className="select_recetas input_edit"
            name="idCategorias"
            {...sharedPropsCategorias}
            /* value={alumnos} */
            onChange={handleChangeSelectCategoriasFiltrar}
          />
        </div>
      </nav>
      <div className="cont_ejercicio">
        <ListVideos videos={videosSearch.length > 0 ? dbSearch : videos} />
      </div>
    </div>
  );
};
