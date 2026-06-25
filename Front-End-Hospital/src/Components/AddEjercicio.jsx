import React, { useContext, useEffect, useState } from "react";
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
import "../style.css";
import EjerciciosContext from "../Contexts/EjercicioContext";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import { Input } from "@chakra-ui/react";
import ReactPlayer from "react-player";


import { Upload, Select } from "antd";
import { entorno } from "../services/config";

export const AddEjercicio = ({ onClosePadre }) => {
  const {
    ejercicioToInsert,
    handleChangeInputInsert,
    addEjercicio,
    bandInsert,
    handleInsert,
    handleChangeSelectInsert,
    handleCloseVentEmergConfirmacion,
    patologiasxEjercicioAdd,
    categoriasxInformacionAdd,
    handleChangeSelectCategoriasInsert,
    loadingAction,
  } = useContext(EjerciciosContext);
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
    options: categoriasxInformacionAdd,
    placeholder: "Seleccione una Categoría",
    maxTagCount: "responsive",
  };

  const [showVentEmergenteConfirmacion, setShowVentEmergenteConfirmacion] =
    useState(false);

  const [fileList, setFileList] = useState([]);
  const [shouldInsert, setShouldInsert] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [iframeUrl, setIframeUrl] = useState(null);
  const [useYoutube, setUseYoutube] = useState(false);
  const [disableFileUpload, setDisableFileUpload] = useState(false);
  const [disableYoutubeInput, setDisableYoutubeInput] = useState(false);

  const [bandPrueba, setBandPrueba] = useState(false);

  const handleCloseVentEmergente = async () => {
    setShowVentEmergenteConfirmacion(false);
  };

  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList.length > 0) {
      setDisableYoutubeInput(true); // Deshabilitar la entrada de URL de YouTube
      setUseYoutube(false); // Indicar que no se utilizará la URL de YouTube
    } else {
      setDisableYoutubeInput(false); // Habilitar la entrada de URL de YouTube
    }
    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      const file = newFileList[0].originFileObj;
      const url = URL.createObjectURL(file);
      console.log(url);
      setPreviewUrl(url);
    }
  };
  const handleYoutubeUrlChange = (e) => {
    const url = e.target.value;
    setYoutubeUrl(url);
    if (url) {
      setDisableFileUpload(true); // Deshabilitar la carga de archivos
      setIframeUrl(url); // Establecer la URL del iframe
      setUseYoutube(true); // Indicar que se utilizará la URL de YouTube
    } else {
      setDisableFileUpload(false); // Habilitar la carga de archivos
      setIframeUrl(null); // Limpiar la URL del iframe
      setUseYoutube(false); // Indicar que no se utilizará la URL de YouTube
    }
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
      return data.url; // Suponiendo que el backend devuelve la URL del video
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
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
  // Función para limpiar líneas vacías
  const cleanTextFields = (text) => {
    if (!text) return text;
    return text
      .split("\n")
      .map(line => line.trim())
      .filter(line => line !== "")
      .join("\n");
  };

  const handleInsertWithVideo = async () => {
    try {
      let urlVideo = "";
      if (useYoutube && youtubeUrl) {
        urlVideo = youtubeUrl;
      } else if (fileList.length > 0) {
        const uploadedVideoUrls = await Promise.all(
          fileList.map((file) => handleFileUpload(file.originFileObj))
        );
        urlVideo = uploadedVideoUrls[0];
      }

      const fullEjercicio = {
        ...ejercicioToInsert,
        urlVideo: urlVideo,
        descripcion: cleanTextFields(ejercicioToInsert.descripcion),
      };

      await toast.promise(handleInsert(fullEjercicio), {
        loading: "Cargando Ejercicio...",
        success: <b>Se agregó el Ejercicio!</b>,
        error: <b>No se pudo agregar el ejercicio.</b>,
      });
    } catch (error) {
      console.error("Error inserting ejercicio:", error);
      throw error;
    }
  };
  /* 
  useEffect(() => {
    console.log("Valor de ejercicioToInsert:", ejercicioToInsert);
  
    // Verificar si shouldInsert es true y si hay una URL de video cargada o si no se espera video
    if (ejercicioToInsert.urlVideo) {
      console.log("Ejecutando handleInsert");
      handleInsert();
      setShouldInsert(false); // Reiniciar el estado para futuras inserciones
    }
  }, [ ejercicioToInsert]); */

  return (
    <div className="form">

      <Grid
        className="grid_chackra"
        templateColumns={{
          base: "1fr",
          md: "repeat(auto-fit, minmax(400px, 1fr))",
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
              className={`input_floating`}
              placeholder=""
              name="nombre"
              variant="outlined"
              type="text"
              value={ejercicioToInsert?.nombre ? ejercicioToInsert.nombre : ""}
              onChange={(e) => handleChangeInputInsert(e)}
            />
            <FormLabel>Nombre</FormLabel>
          </FormControl>
        </GridItem>
        <GridItem colSpan={{ base: 1, md: 2 }}>
          <Tabs>
            <TabList>
              <Tab>Cargar Video</Tab>
              <Tab>Youtube</Tab>
            </TabList>
            <TabPanels>
              <TabPanel className="tab_video_iframe">
                {previewUrl && (
                  <div style={{ position: 'relative', paddingTop: '56.25%', width: '100%', marginBottom: '1rem', background: 'var(--gray-100)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                    <ReactPlayer
                      width="100%"
                      height="100%"
                      style={{ position: 'absolute', top: 0, left: 0 }}
                      controls
                      url={previewUrl}
                    />
                  </div>
                )}
                <GridItem colSpan={{ base: 1, md: 2 }}>
                  <Upload
                    className="imgCrop"
                    listType="picture-card"
                    fileList={fileList}
                    beforeUpload={beforeUpload}
                    maxCount={1}
                    disabled={disableFileUpload} // Deshabilitar condicionalmente
                    progress={true}
                    showUploadList={false}
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
                    customRequest={({ file, onSuccess }) => {
                      setTimeout(() => {
                        onSuccess("ok");
                      }, 0);
                    }}
                    onChange={handleFileChange}
                  >
                    {/* fileList.length < 1 &&  */ "Subir Video"}
                  </Upload>
                </GridItem>
              </TabPanel>
              <TabPanel>
                <GridItem colSpan={{ base: 1, md: 2 }}>
                  <FormControl
                    className="cont_input_edit"
                    variant="floating"
                    id="youtubeUrl"
                  >
                    <Textarea
                      className={`input_floating `}
                      placeholder=""
                      name="youtubeUrl"
                      variant="outlined"
                      type="text"
                      disabled={disableYoutubeInput} // Deshabilitar condicionalmente
                      onChange={handleYoutubeUrlChange}
                      value={youtubeUrl}
                    />
                    <FormLabel>Iframe YouTube</FormLabel>
                  </FormControl>
                </GridItem>
                {iframeUrl && (
                  <GridItem colSpan={{ base: 1, md: 2 }}>
                    <div style={{ position: 'relative', paddingTop: '56.25%', width: '100%', marginTop: '1rem', background: 'var(--gray-100)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                      <div
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                        dangerouslySetInnerHTML={{
                          __html: iframeUrl.replace(
                            "<iframe",
                            "<iframe style='width: 100%; height: 100%; border: none;'"
                          ),
                        }}
                      />
                    </div>
                  </GridItem>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </GridItem>
        <GridItem colSpan={{ base: 1, md: 1 }}>
          {/* SELECT DE LAS PATOLOGIAS */}
          <FormControl isRequired>
            <FormLabel>Patologias</FormLabel>
            <Select
              name="idPatologias"
              {...sharedProps}
              /* value={alumnos} */
              onChange={handleChangeSelectInsert}
            />
          </FormControl>
        </GridItem>

        <GridItem colSpan={{ base: 1, md: 1 }}>
          {/* SELECT DE LAS CATEGORIAS */}
          <FormControl isRequired>
            <FormLabel>Categorias</FormLabel>
            <Select
              name="idCategorias"
              {...sharedPropsCategorias}
              /* value={alumnos} */
              onChange={handleChangeSelectCategoriasInsert}
            />
          </FormControl>
        </GridItem>

        <GridItem colSpan={{ base: 1, md: 1 }}>
          {/* TIPO DE CONTENIDO */}
          <FormControl isRequired>
            <FormLabel>Tipo de Contenido</FormLabel>
            <Select
              style={{ width: "100%" }}
              value={ejercicioToInsert?.tipoContenido || "video"}
              onChange={(value) => handleChangeInputInsert({ target: { name: "tipoContenido", value } })}
              options={[
                { label: "Video", value: "video" },
                { label: "Infografia", value: "infografia" },
                { label: "Ambos", value: "ambos" },
              ]}
            />
          </FormControl>
        </GridItem>

        {(ejercicioToInsert?.tipoContenido === "infografia" || ejercicioToInsert?.tipoContenido === "ambos") && (
          <GridItem colSpan={{ base: 1, md: 1 }}>
            <FormControl
              className="cont_input_edit"
              variant="floating"
              id="urlInfografia"
              isRequired
            >
              <Input
                className="input_floating"
                placeholder=""
                name="urlInfografia"
                variant="outlined"
                type="text"
                value={ejercicioToInsert?.urlInfografia ? ejercicioToInsert.urlInfografia : ""}
                onChange={(e) => handleChangeInputInsert(e)}
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
              className={`input_floating`}
              placeholder=""
              name="descripcion"
              size="sm"
              variant="outlined"
              type="text"
              value={
                ejercicioToInsert?.descripcion
                  ? ejercicioToInsert.descripcion
                  : ""
              }
              onChange={(e) => handleChangeInputInsert(e)}
            />
            <FormLabel>Descripcion</FormLabel>
          </FormControl>
        </GridItem>
      </Grid>

      {bandInsert ? (
        <Button
          className="btn_accion_edit_ejercicio"
          colorScheme="green"
          style={{ margin: "1rem auto 0" }}
          onClick={() => setShowVentEmergenteConfirmacion(true)}
          isLoading={loadingAction}
        >
          Agregar Ejercicio
        </Button>
      ) : null}

      {/* <VentEmergConfirmacion
        onClosePadre={onClosePadre}
        onClose={handleCloseVentEmergente}
        mje={"Esta seguro de agregar a la ejercicio? "}
        handleSi={handleInsert}
        isOpen={showVentEmergenteConfirmacion}
      /> */}
      <VentEmergConfirmacion
        onClosePadre={onClosePadre}
        onClose={handleCloseVentEmergente}
        mje={"Esta seguro de agregar a la ejercicio? "}
        handleSi={handleInsertWithVideo}
        isOpen={showVentEmergenteConfirmacion}
      />
    </div>
  );
};
