import {
  Button,
  ButtonGroup,
  Textarea,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { Tabs, Tab, TabList, TabPanel, TabPanels } from "@chakra-ui/react";

import { Space, Upload, Select } from "antd";
import React, { useContext, useEffect, useState } from "react";
import "../style.css";
import ReactPlayer from "react-player";

import { VentEmergConfirmacion } from "./VentEmergConfirmacion";

import EjerciciosContext from "../Contexts/EjercicioContext";
import { useNavigate } from "react-router-dom";
import { Input } from "@chakra-ui/react";
import { entorno } from "../services/config";

export const EditEjercicio = ({ ejercicio, onCloseEdit }) => {
  /* console.log(
    "edit ejercicio: ",
    ejercicio,
    entorno.slice(0, -4) + ejercicio.urlVideo
  ); */

  const navigate = useNavigate();
  const handleShowConsulta = (ndocu) => {
    navigate("/ejercicio/" + ndocu);
  };

  const [bandEdit, setBandEdit] = useState(false);
  const [bandUpdated, setBandUpdated] = useState(false);
  const [showVentEmergenteConfirmacion, setShowVentEmergenteConfirmacion] =
    useState(false);
  const [previewUrl, setPreviewUrl] = useState(
    ejercicio?.urlVideo ? entorno.slice(0, -4) + ejercicio.urlVideo : null
  );
  const [urlVideo, setUrlVideo] = useState("");

  const [fileList, setFileList] = useState(
    ejercicio.urlVideo
      ? [
          {
            uid: "-1",
            name: "image.png",
            status: "done",
            url: entorno.slice(0, -4) + ejercicio.urlVideo,
          },
        ]
      : []
  );
  const [patologiasAsociadas, setPatologiasAsociadas] = useState([]);
  const [patologiasNoAsociadas, setPatologiasNoAsociadas] = useState([]);
  const [selectedPatologias, setSelectedPatologias] = useState([]);
  const [opcionesPatologias, setOpcionesPatologias] = useState([]);

  /* ------------------------- */

  const [categoriasAsociadas, setCategoriasAsociadas] = useState([]);
  const [categoriasNoAsociadas, setCategoriasNoAsociadas] = useState([]);
  const [selectedCategorias, setSelectedCategorias] = useState([]);
  const [opcionesCategorias, setOpcionesCategorias] = useState([]);

  /* ------------------------- */

  const {
    handleChangeInput,
    handleUpdate,
    handleChangeSelect,
    patologiasxEjercicioEdit,
    categoriasxEjercicioEdit,
    handleChangeSelectCategorias,
  } = useContext(EjerciciosContext);
  if (!ejercicio) {
    return null;
  }

  console.log("ejercicio:", ejercicio);

  const sharedProps = {
    mode: "multiple",
    style: { width: "100%" },
    options: opcionesPatologias,
    placeholder: "Seleccione una Patología",
    maxTagCount: "responsive",
    value: selectedPatologias,
    renderOptionLabel: (option) => (
      <div>
        {option.label} {option.type === "asociada" ? "(Asociada)" : ""}
      </div>
    ),
  };

  const sharedPropsCategorias = {
    mode: "multiple",
    style: { width: "100%" },
    options: opcionesCategorias,
    placeholder: "Seleccione una Categoria",
    maxTagCount: "responsive",
    value: selectedCategorias,
    renderOptionLabel: (option) => (
      <div>
        {option.label} {option.type === "asociada" ? "(Asociada)" : ""}
      </div>
    ),
  };

  useEffect(() => {
    setBandUpdated(bandEdit);
  }, [bandEdit]);

  useEffect(() => {
    setFileList(
      ejercicio.urlVideo
        ? [
            {
              uid: "-1",
              name: "image.png",
              status: "done",
              url: entorno.slice(0, -4) + ejercicio.urlVideo,
            },
          ]
        : []
    );
    if (ejercicio?.urlVideo) {
      setUrlVideo(ejercicio?.urlVideo);
    }

    /* if (!previewUrl) {
      setPreviewUrl(entorno.slice(0, -4) + ejercicio.urlVideo);
    } */
  }, [ejercicio]);

  useEffect(() => {
    handleChangeInput({ target: { name: "urlVideo", value: urlVideo } });

    if (urlVideo.includes("<iframe")) {
      setPreviewUrl(urlVideo);
    } else {
      if (urlVideo.includes("blob")) {
        setPreviewUrl(urlVideo);
      } else {
        setPreviewUrl(entorno.slice(0, -4) + urlVideo);
      }
    }
  }, [urlVideo]);

  useEffect(() => {
    console.log(patologiasxEjercicioEdit);
    if (
      patologiasxEjercicioEdit &&
      Object.values(patologiasxEjercicioEdit).length > 1
    ) {
      setPatologiasAsociadas(patologiasxEjercicioEdit.patologiasAsociadas);
      setPatologiasNoAsociadas(patologiasxEjercicioEdit.patologiasNoAsociadas);
      setSelectedPatologias(
        patologiasxEjercicioEdit.patologiasAsociadas.map((p) => p.id)
      );
    }
  }, [patologiasxEjercicioEdit]);

  useEffect(() => {
    console.log(categoriasxEjercicioEdit);
    if (
      categoriasxEjercicioEdit &&
      Object.values(categoriasxEjercicioEdit).length > 1
    ) {
      setCategoriasAsociadas(categoriasxEjercicioEdit.categoriasAsociadas);
      setCategoriasNoAsociadas(categoriasxEjercicioEdit.categoriasNoAsociadas);
      setSelectedCategorias(
        categoriasxEjercicioEdit.categoriasAsociadas.map((p) => p.id)
      );
    }
  }, [categoriasxEjercicioEdit]);

  useEffect(() => {
    if (patologiasAsociadas.length > 0 || patologiasNoAsociadas.length > 0) {
      console.log(
        "patologiasAsociadas,patologiasNoAsociadas: ",
        patologiasAsociadas,
        patologiasNoAsociadas
      );
      setOpcionesPatologias([
        ...patologiasAsociadas.map((p) => ({
          label: p.nombre,
          value: p.id,
          type: "asociada",
        })),
        ...patologiasNoAsociadas.map((p) => ({
          label: p.nombre,
          value: p.id,
          type: "no-asociada",
        })),
      ]);
    }
  }, [patologiasAsociadas, patologiasNoAsociadas]);

  useEffect(() => {
    if (categoriasAsociadas.length > 0 || categoriasNoAsociadas.length > 0) {
      console.log(
        "categoriasAsociadas,categoriasNoAsociadas: ",
        categoriasAsociadas,
        categoriasNoAsociadas
      );
      setOpcionesCategorias([
        ...categoriasAsociadas.map((p) => ({
          label: p.nombre,
          value: p.id,
          type: "asociada",
        })),
        ...categoriasNoAsociadas.map((p) => ({
          label: p.nombre,
          value: p.id,
          type: "no-asociada",
        })),
      ]);
    }
  }, [categoriasAsociadas, categoriasNoAsociadas]);

  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      const file = newFileList[0].originFileObj;
      const url = URL.createObjectURL(file);
      console.log(url);
      setPreviewUrl(url);
      handleChangeInput({ target: { name: "urlVideo", value: url } });
    }
  };
  const beforeUpload = (file) => {
    const isImageOrVideo =
      file.type.startsWith("image/") || file.type.startsWith("video/");

    if (!isImageOrVideo) {
      console.error("Solo se permiten archivos de imagen o video");
      return Upload.LIST_IGNORE;
    }
    return true;
  };
  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(entorno + "/ejercicios/upload/files", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      return data.url; // Suponiendo que el backend devuelve la URL de la imagen
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const handleUpdateWithImage = async () => {
    try {
      let urlVideo;
      if (fileList.length > 0 && fileList[fileList.length - 1].originFileObj) {
        urlVideo = await handleFileUpload(
          fileList[fileList.length - 1].originFileObj
        ); // Usa la última imagen cargada
        console.log(urlVideo);

        handleChangeInput({ target: { name: "urlVideo", value: urlVideo } });
      }
      handleUpdate(
        urlVideo
          ? {
              ...ejercicio,
              urlVideo: urlVideo,
            }
          : ejercicio
      );
    } catch (error) {
      console.error("Error updating recipe:", error);
    }
  };

  return (
    <div className="">
      <div className="form_edit_informacion">
        <FormControl
          className="cont_input_edit"
          variant="floating"
          id="nombre"
          isRequired
        >
          <Input
            className={`input_edit ${!bandEdit ? "input_disabled" : ""}`}
            label="Nombre"
            name="nombre"
            variant="outlined"
            type="text"
            disabled={!bandEdit}
            value={ejercicio.nombre ? ejercicio.nombre : ""}
            onChange={(e) => handleChangeInput(e)}
          />
          <FormLabel>Nombre</FormLabel>
        </FormControl>

        {previewUrl &&
          (previewUrl.includes("<iframe") ? (
            <div
              style={{ height: "50% !important" , width:"50% !important" , padding: "2rem !important" }}
              dangerouslySetInnerHTML={{  __html: previewUrl.replace("<iframe", "<iframe style='width: 100%; height: 100%; border: none;'") }}
            />
          ) : (
            <ReactPlayer width="60%" height="100%" controls url={previewUrl} />
          ))}

        <Tabs variant="enclosed">
          <TabList>
            <Tab>Subir/Actualizar Video</Tab>
            <Tab>Actualizar Iframe</Tab>
          </TabList>
          <TabPanels>
            <TabPanel className="tab_video_iframe">
              <Upload
                className="imgCrop"
                listType="picture-card"
                fileList={fileList}
                beforeUpload={beforeUpload}
                maxCount={1}
                progress={true}
                disabled={!bandEdit}
                onPreview={async (file) => {
                  // Si el archivo ya tiene una URL (por ejemplo, un archivo previamente subido)
                  if (file.url) {
                    // Abre la URL del archivo en una nueva ventana
                    window.open(file.url);
                  } else {
                    // Si el archivo no tiene URL, genera una URL de previsualización usando FileReader
                    const preview = await new Promise((resolve, reject) => {
                      const reader = new FileReader();
                      reader.readAsDataURL(file.originFileObj); // Lee el archivo como una URL de datos
                      reader.onload = () => resolve(reader.result); // Resuelve la promesa con la URL de datos
                      reader.onerror = (error) => reject(error); // Rechaza la promesa si hay un error
                    });
                    // Abre una nueva ventana y escribe la previsualización del archivo en la ventana
                    const imgWindow = window.open();
                    imgWindow.document.write(
                      `<img src="${preview}" alt="preview" />`
                    );
                  }
                }}
                showUploadList={false}
                customRequest={({ file, onSuccess }) => {
                  setTimeout(() => {
                    onSuccess("ok");
                  }, 0);
                }}
                onChange={handleFileChange}
              >
                {"Subir Video"}
              </Upload>
            </TabPanel>
            <TabPanel>
              <FormControl>
                <FormLabel htmlFor="iframeUrl">Iframe URL</FormLabel>
                <Input
                  id="iframeUrl"
                  disabled={!bandEdit}
                  value={urlVideo}
                  onChange={(e) => setUrlVideo(e.target.value)}
                  placeholder="Ingrese la URL del iframe"
                />
              </FormControl>
            </TabPanel>
          </TabPanels>
        </Tabs>
        {/* SELECT DE LAS PATOLOGIAS */}
        <Select
          disabled={!bandEdit}
          name="idPatologias"
          className="select_recetas input_edit"
          {...sharedProps}
          /* value={alumnos} */
          onChange={(e) => {
            console.log(e);
            handleChangeSelect(e);
            setSelectedPatologias(e);
          }}
        />
        {/* SELECT DE LAS CATEGORIAS */}
        <Select
          disabled={!bandEdit}
          name="idCategorias"
          className="select_recetas input_edit"
          {...sharedPropsCategorias}
          /* value={alumnos} */
          onChange={(e) => {
            console.log(e);
            handleChangeSelectCategorias(e);
            setSelectedCategorias(e);
          }}
        />

        <FormControl
          className="cont_input_edit"
          variant="floating"
          id="descripcion"
          isRequired
        >
          <Textarea
            className={`input_edit ${!bandEdit ? "input_disabled" : ""}`}
            label="Descripcion"
            name="descripcion"
            size="sm"
            variant="outlined"
            type="text"
            disabled={!bandEdit}
            value={ejercicio.descripcion ? ejercicio.descripcion : ""}
            onChange={(e) => handleChangeInput(e)}
          />
          <FormLabel>Descripción</FormLabel>
        </FormControl>
      </div>

      <div className="cont_btns_acciones_ejercicio">
        {!bandEdit ? (
          <Button
            className="btn_accion_edit_ejercicio"
            /* variant="outlined" */
            colorScheme="blue"
            onClick={() => setBandEdit(true)}
          >
            Editar
          </Button>
        ) : (
          <Button
            className="btn_accion_edit_ejercicio"
            /* variant="contained" */
            color="info"
            onClick={() => setBandEdit(false)}
          >
            Cancelar
          </Button>
        )}

        {bandUpdated ? (
          <Button
            className="btn_accion_edit_ejercicio"
            colorScheme="green"
            /* variant="contained"
            style={{ margin: "1rem auto 0" }} */
            onClick={() => setShowVentEmergenteConfirmacion(true)}
          >
            Actualizar
          </Button>
        ) : null}
      </div>

      <VentEmergConfirmacion
        onClosePadre={onCloseEdit}
        onClose={() => setShowVentEmergenteConfirmacion(false)}
        mje={
          "Esta seguro de actualizar los datos del ejercicio " +
          /*  ejercicio?.nombre?.toUpperCase() +
            ", " +
            ejercicio?.apellido?.toUpperCase() + */
          " ?"
        }
        handleSi={() => handleUpdate(ejercicio)}
        isOpen={showVentEmergenteConfirmacion}
      />
    </div>
  );
};

/* 
  <TextField
                  className="input_carga plan_anioc_edicion_input"
                  id="outlined-basic"
                  label="Año de Cursado"
                  variant="outlined"
                  name="añoc"
                  type="number"
                  onChange={(e) => {
                    handleChange(e);
                    setCurso({
                      ...curso,
                      añoc: e.target.value,
                    });
                  }}
                  onBlur={() => handleBlurElementosForm("añoc")}
                  value={curso.añoc ? curso.añoc : ""}
                />
  */
