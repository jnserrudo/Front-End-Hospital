import { Tabs, Tab, TabList, TabPanel, TabPanels } from "@chakra-ui/react";

import {
  Button,
  ButtonGroup,
  Textarea,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { Space, Upload, Select } from "antd";
import React, { useContext, useEffect, useState } from "react";
import "../style.css";
import ReactPlayer from "react-player";

import { VentEmergConfirmacion } from "./VentEmergConfirmacion";

import InformacionsContext from "../Contexts/InformacionContext";
import { useNavigate } from "react-router-dom";
import { Input } from "@chakra-ui/react";
import { entorno } from "../services/config";

export const EditInformacion = ({ informacion, onCloseEdit }) => {
  /* console.log(
    "edit informacion: ",
    informacion,
    entorno.slice(0, -4) + informacion.urlVideo
  ); */
  if (!informacion) {
    return null;
  }
  const navigate = useNavigate();
  const handleShowConsulta = (ndocu) => {
    navigate("/informacion/" + ndocu);
  };

  const [bandEdit, setBandEdit] = useState(false);
  const [bandUpdated, setBandUpdated] = useState(false);
  const [showVentEmergenteConfirmacion, setShowVentEmergenteConfirmacion] =
    useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [urlVideo, setUrlVideo] = useState("");

  const [fileList, setFileList] = useState(
    informacion.urlVideo
      ? [
          {
            uid: "-1",
            name: "image.png",
            status: "done",
            url: entorno.slice(0, -4) + informacion.urlVideo,
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
    patologiasxInformacionEdit,
    categoriasxInformacionEdit,
    handleChangeSelectCategorias,
  } = useContext(InformacionsContext);

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
      informacion.urlVideo
        ? [
            {
              uid: "-1",
              name: "image.png",
              status: "done",
              url: entorno.slice(0, -4) + informacion.urlVideo,
            },
          ]
        : []
    );
    if (informacion?.urlVideo) {
      setUrlVideo(informacion?.urlVideo);
    }
    /* console.log("el valor de previewurl es: ",previewUrl)
    if (!previewUrl && informacion?.urlVideo?.length>0) {
      console.log("SE VA A PONER EN EL PREVIEWURL LO SGTE: ",entorno.slice(0, -4) + informacion.urlVideo)
      setPreviewUrl(entorno.slice(0, -4) + informacion.urlVideo);
    } */
  }, [informacion]);

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
    console.log(patologiasxInformacionEdit);
    if (
      patologiasxInformacionEdit &&
      Object.values(patologiasxInformacionEdit).length > 1
    ) {
      setPatologiasAsociadas(patologiasxInformacionEdit.patologiasAsociadas);
      setPatologiasNoAsociadas(
        patologiasxInformacionEdit.patologiasNoAsociadas
      );
      setSelectedPatologias(
        patologiasxInformacionEdit.patologiasAsociadas.map((p) => p.id)
      );
    }
  }, [patologiasxInformacionEdit]);

  useEffect(() => {
    console.log(categoriasxInformacionEdit);
    if (
      categoriasxInformacionEdit &&
      Object.values(categoriasxInformacionEdit).length > 0
    ) {
      setCategoriasAsociadas(categoriasxInformacionEdit.categoriasAsociadas);
      setCategoriasNoAsociadas(
        categoriasxInformacionEdit.categoriasNoAsociadas
      );
      setSelectedCategorias(
        categoriasxInformacionEdit.categoriasAsociadas.map((p) => p.id)
      );
    }
  }, [categoriasxInformacionEdit]);

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
      const response = await fetch(entorno + "/informacion/upload/files", {
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
              ...informacion,
              urlVideo: urlVideo,
            }
          : informacion
      );
    } catch (error) {
      console.error("Error updating recipe:", error);
    }
  };

  return (
    <div className="form">
      <Grid
        className="grid_chackra"
        templateColumns={{
          base: "1fr",
          md: "repeat(auto-fit, minmax(470px, 1fr))",
        }}
        gap={10}
      >
        <GridItem colSpan={{ base: 1, md: 2 }}>
          <FormControl
            className="cont_input_edit"
            variant="floating"
            id="nombre"
            isRequired
          >
            <Input
              className={`input_floating ${!bandEdit ? "input_disabled" : ""}`}
              label="Nombre"
              name="nombre"
              variant="outlined"
              type="text"
              disabled={!bandEdit}
              value={informacion.nombre ? informacion.nombre : ""}
              onChange={(e) => handleChangeInput(e)}
            />
            <FormLabel>Nombre</FormLabel>
          </FormControl>
        </GridItem>
        {previewUrl &&
          (previewUrl.includes("<iframe") ? (
            <GridItem
              colSpan={{ base: 1, md: 2 }}
              rowSpan={2}
              style={{ height: "60vh" }}
            >
              <div
                style={{ height: "100%", padding: "2rem !important" }}
                dangerouslySetInnerHTML={{
                  __html: previewUrl.replace(
                    "<iframe",
                    "<iframe style='width: 100%; height: 100%; border: none;'"
                  ),
                }}
              />
            </GridItem>
          ) : (
            <GridItem colSpan={{ base: 1, md: 2 }}>
              <ReactPlayer
                width="60%"
                height="100%"
                controls
                url={previewUrl}
              />
            </GridItem>
          ))}

        <Tabs variant="enclosed">
          <TabList>
            <Tab>Subir/Actualizar Video</Tab>
            <Tab>Actualizar Iframe</Tab>
          </TabList>
          <TabPanels>
            <TabPanel className="tab_video_iframe">
              <GridItem colSpan={{ base: 1, md: 2 }}>
                <Upload
                  className="imgCrop"
                  listType="picture-card"
                  fileList={fileList}
                  beforeUpload={beforeUpload}
                  maxCount={1}
                  progress={true}
                  disabled={!bandEdit}
                  onPreview={async (file) => {
                    if (file.url) {
                      window.open(file.url);
                    } else {
                      const preview = await new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.readAsDataURL(file.originFileObj);
                        reader.onload = () => resolve(reader.result);
                        reader.onerror = (error) => reject(error);
                      });
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
              </GridItem>
            </TabPanel>
            <TabPanel>
              <GridItem colSpan={{ base: 1, md: 2 }}>
                <FormControl >
                  <FormLabel htmlFor="iframeUrl">Iframe URL</FormLabel>
                  <Textarea
                    className={`input_floating ${
                      !bandEdit ? "input_disabled" : ""
                    }`}
                    size="sm"
                    variant="outlined"
                    type="text"
                    id="iframeUrl"
                    disabled={!bandEdit}
                    value={urlVideo}
                    onChange={(e) => setUrlVideo(e.target.value)}
                    placeholder="Ingrese la URL del iframe"
                  />
                </FormControl>
              </GridItem>
            </TabPanel>
          </TabPanels>
        </Tabs>

        <GridItem colSpan={{ base: 1, md: 2 }}>
          {/* SELECT DE LAS PATOLOGIAS */}
          <Select
            disabled={!bandEdit}
            name="idPatologias"
            {...sharedProps}
            /* value={alumnos} */
            onChange={(e) => {
              console.log(e);
              handleChangeSelect(e);
              setSelectedPatologias(e);
            }}
          />
        </GridItem>
        <GridItem colSpan={{ base: 1, md: 2 }}>
          {/* SELECT DE LAS CATEGORIAS */}
          <Select
            disabled={!bandEdit}
            name="idCategorias"
            {...sharedPropsCategorias}
            /* value={alumnos} */
            onChange={(e) => {
              console.log(e);
              handleChangeSelectCategorias(e);
              setSelectedCategorias(e);
            }}
          />
        </GridItem>
        <GridItem colSpan={{ base: 1, md: 2 }}>
          <FormControl
            className="cont_input_edit"
            variant="floating"
            id="descripcion"
            isRequired
          >
            <Textarea
              className={`input_floating ${!bandEdit ? "input_disabled" : ""}`}
              label="Descripcion"
              name="descripcion"
              size="sm"
              variant="outlined"
              type="text"
              disabled={!bandEdit}
              value={informacion.descripcion ? informacion.descripcion : ""}
              onChange={(e) => handleChangeInput(e)}
            />
            <FormLabel>Descripción</FormLabel>
          </FormControl>
        </GridItem>
      </Grid>

      <div className="cont_btns_acciones">
        {!bandEdit ? (
          <Button
            className="btn_accion_edit_informacion"
            /* variant="outlined" */
            colorScheme="blue"
            onClick={() => setBandEdit(true)}
          >
            Editar
          </Button>
        ) : (
          <Button
            className="btn_accion_edit_informacion"
            /* variant="contained" */
            color="info"
            onClick={() => setBandEdit(false)}
          >
            Cancelar
          </Button>
        )}

        {bandUpdated ? (
          <Button
            className="btn_accion_edit_informacion"
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
          "Esta seguro de actualizar los datos del informacion " +
          /*  informacion?.nombre?.toUpperCase() +
            ", " +
            informacion?.apellido?.toUpperCase() + */
          " ?"
        }
        handleSi={() => handleUpdate(informacion)}
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
