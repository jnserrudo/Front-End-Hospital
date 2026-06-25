import {
  Button,
  ButtonGroup,
  Textarea,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
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
import { entorno, getMediaUrl } from "../services/config";

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
    ejercicio?.urlVideo ? getMediaUrl(ejercicio.urlVideo) : null
  );
  const [urlVideo, setUrlVideo] = useState("");

  const [fileList, setFileList] = useState(
    ejercicio.urlVideo
      ? [
          {
            uid: "-1",
            name: "image.png",
            status: "done",
            url: getMediaUrl(ejercicio.urlVideo),
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
    loadingAction,
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
              url: getMediaUrl(ejercicio.urlVideo),
            },
          ]
        : []
    );
    if (ejercicio?.urlVideo) {
      setUrlVideo(ejercicio?.urlVideo);
    }

    /* if (!previewUrl) {
      setPreviewUrl(getMediaUrl(ejercicio.urlVideo));
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
        setPreviewUrl(getMediaUrl(urlVideo));
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

  // Función para limpiar líneas vacías
  const cleanTextFields = (text) => {
    if (!text) return text;
    return text
      .split("\n")
      .map(line => line.trim())
      .filter(line => line !== "")
      .join("\n");
  };

  const handleUpdateWithImage = async () => {
    try {
      let urlVideo;
      if (fileList.length > 0 && fileList[fileList.length - 1].originFileObj) {
        urlVideo = await handleFileUpload(
          fileList[fileList.length - 1].originFileObj
        );
        console.log(urlVideo);
        handleChangeInput({ target: { name: "urlVideo", value: urlVideo } });
      }
      
      const ejercicioToUpdate = urlVideo ? { ...ejercicio, urlVideo } : ejercicio;
      const ejercicioLimpio = {
        ...ejercicioToUpdate,
        descripcion: cleanTextFields(ejercicioToUpdate.descripcion),
      };
      
      handleUpdate(ejercicioLimpio);
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
          md: "repeat(auto-fit, minmax(350px, 1fr))",
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
              value={ejercicio.nombre ? ejercicio.nombre : ""}
              onChange={(e) => handleChangeInput(e)}
            />
            <FormLabel>Nombre</FormLabel>
          </FormControl>
        </GridItem>
          {previewUrl &&
          (previewUrl.includes("<iframe") ? (
              <GridItem colSpan={{ base: 1, md: 2 }}>
                <div style={{ position: 'relative', paddingTop: '56.25%', width: '100%', marginBottom: '1rem', background: 'var(--gray-100)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  <div
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    dangerouslySetInnerHTML={{
                      __html: previewUrl.replace(
                        "<iframe",
                        "<iframe style='width: 100%; height: 100%; border: none;'"
                      ),
                    }}
                  />
                </div>
              </GridItem>
            ) : (
              <GridItem colSpan={{ base: 1, md: 2 }}>
                <div style={{ position: 'relative', paddingTop: '56.25%', width: '100%', marginBottom: '1rem', background: 'var(--gray-100)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  <ReactPlayer width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }} controls url={previewUrl} />
                </div>
              </GridItem>
            ))}
        <GridItem colSpan={{ base: 1, md: 2 }}>
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
                        `<img src="${preview}" alt="preview" onerror="this.style.display='none'; this.parentElement.innerHTML='<p style=\'color:red;text-align:center;padding:20px;\'>Error al cargar la imagen</p>'" />`
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
        </GridItem>

        <GridItem colSpan={{ base: 1, md: 1 }}>
          {/* SELECT DE LAS PATOLOGIAS */}
          <FormControl isRequired>
            <FormLabel>Patologias</FormLabel>
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
          </FormControl>
        </GridItem>
        <GridItem colSpan={{ base: 1, md: 1 }}>
          {/* SELECT DE LAS CATEGORIAS */}
          <FormControl isRequired>
            <FormLabel>Categorias</FormLabel>
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
          </FormControl>
        </GridItem>

        <GridItem colSpan={{ base: 1, md: 1 }}>
          {/* TIPO DE CONTENIDO */}
          <FormControl isRequired>
            <FormLabel>Tipo de Contenido</FormLabel>
            <Select
              disabled={!bandEdit}
              style={{ width: "100%" }}
              value={ejercicio?.tipoContenido || "video"}
              onChange={(value) => handleChangeInput({ target: { name: "tipoContenido", value } })}
              options={[
                { label: "Video", value: "video" },
                { label: "Infografia", value: "infografia" },
                { label: "Ambos", value: "ambos" },
              ]}
            />
          </FormControl>
        </GridItem>

        {(ejercicio?.tipoContenido === "infografia" || ejercicio?.tipoContenido === "ambos") && (
          <GridItem colSpan={{ base: 1, md: 1 }}>
            <FormControl
              className="cont_input_edit"
              variant="floating"
              id="urlInfografia"
              isRequired
            >
              <Input
                className={`input_floating ${!bandEdit ? "input_disabled" : ""}`}
                placeholder=""
                name="urlInfografia"
                variant="outlined"
                type="text"
                disabled={!bandEdit}
                value={ejercicio?.urlInfografia ? ejercicio.urlInfografia : ""}
                onChange={(e) => handleChangeInput(e)}
              />
              <FormLabel>URL de la Infografia</FormLabel>
            </FormControl>
          </GridItem>
        )}

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
              value={ejercicio.descripcion ? ejercicio.descripcion : ""}
              onChange={(e) => handleChangeInput(e)}
            />
            <FormLabel>Descripcion</FormLabel>
          </FormControl>
        </GridItem>
      </Grid>

      <div className="cont_btns_acciones">
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
            onClick={() => setShowVentEmergenteConfirmacion(true)}
            isLoading={loadingAction}
          >
            Actualizar
          </Button>
        ) : null}
      </div>

      <VentEmergConfirmacion
        onClosePadre={onCloseEdit}
        onClose={() => setShowVentEmergenteConfirmacion(false)}
        mje={"¿Está seguro de actualizar los datos del ejercicio?"}
        handleSi={async () => {
          await handleUpdateWithImage();
        }}
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
