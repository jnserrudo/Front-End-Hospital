import React, { useContext, useEffect, useState } from "react";
import { YoutubeEmbed } from "./YoutubeEmbed";
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
import InformacionsContext from "../Contexts/InformacionContext";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import { Input } from "@chakra-ui/react";
import ReactPlayer from "react-player";

import { Upload, Select, Button as AntButton, Alert as AntAlert } from "antd";
import { entorno } from "../services/config";
import { notify } from "../ui/notify";


export const AddInformacion = ({ onClosePadre }) => {
  const {
    informacionToInsert,
    handleChangeInputInsert,
    addInformacion,
    bandInsert,
    handleInsert,
    handleChangeSelectInsert,
    handleCloseVentEmergConfirmacion,
    patologiasxInformacionAdd,
    categoriasxInformacionAdd,
    handleChangeSelectCategoriasInsert,
    loadingAction,
  } = useContext(InformacionsContext);

  const sharedProps = {
    mode: "multiple",
    style: {
      width: "100%",
    },
    options: patologiasxInformacionAdd,
    placeholder: "Elegí una patología",
    maxTagCount: "responsive",
  };

  const sharedPropsCategorias = {
    mode: "multiple",
    style: {
      width: "100%",
    },
    options: categoriasxInformacionAdd,
    placeholder: "Elegí una categoría",
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
      const response = await fetch(entorno + "/informacion/upload/files", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!data?.url || String(data.url).startsWith("blob:")) {
        throw new Error("No pudimos subir el archivo. Probá de nuevo o elegí otro.");
      }
      return data.url;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };
  const beforeUpload = (file) => {
    const esImagen = file.type.startsWith("image/");
    const esVideo = file.type.startsWith("video/");
    if (!esImagen && !esVideo) {
      notify.error("Ese tipo de archivo no está permitido. Subí un video (MP4, WEBM o MOV) o una imagen (JPG, PNG o WEBP).");
      return Upload.LIST_IGNORE;
    }
    const maxMB = esVideo ? 200 : 5;
    if (file.size > maxMB * 1024 * 1024) {
      notify.error(`El archivo es demasiado pesado: el máximo es ${maxMB} MB para ${esVideo ? "videos" : "imágenes"}. Elegí uno más liviano o comprimilo.`);
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

      const fullInformacion = {
        ...informacionToInsert,
        urlVideo: urlVideo,
        descripcion: cleanTextFields(informacionToInsert.descripcion),
      };

      await handleInsert(fullInformacion);
    } catch (error) {
      console.error("Error inserting informacion:", error);
      throw error;
    }
  };
  /* 
  useEffect(() => {
    console.log("Valor de informacionToInsert:", informacionToInsert);
  
    // Verificar si shouldInsert es true y si hay una URL de video cargada o si no se espera video
    if (informacionToInsert.urlVideo) {
      console.log("Ejecutando handleInsert");
      handleInsert();
      setShouldInsert(false); // Reiniciar el estado para futuras inserciones
    }
  }, [ informacionToInsert]); */

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
              className={`input_floating`}
              placeholder=""
              name="nombre"
              variant="outlined"
              type="text"
              value={
                informacionToInsert?.nombre ? informacionToInsert.nombre : ""
              }
              onChange={(e) => handleChangeInputInsert(e)}
            />
            <FormLabel>Nombre</FormLabel>
          </FormControl>
        </GridItem>
        <GridItem colSpan={{ base: 1, md: 2 }}>
          <Tabs>
            <TabList>
              <Tab>Subir archivo</Tab>
              <Tab>Enlace de YouTube</Tab>
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
                      src={previewUrl}
                    />
                  </div>
                )}
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
                        `<img src="${preview}" alt="preview" onerror="this.style.display='none'; this.parentElement.innerHTML='<p style=\'color:#475569;text-align:center;padding:20px;\'>Este archivo no está disponible</p>'" />`
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
                  {/* fileList.length < 1 &&  */ "Tocá para elegir un video o una imagen"}
                </Upload>
                  {disableFileUpload && (
                    <AntAlert
                      type="info"
                      showIcon
                      style={{ marginTop: 8 }}
                      message="La subida de archivo está bloqueada porque ya pegaste un video de YouTube. Borrá el código de YouTube si preferís subir un archivo."
                    />
                  )}
                  {fileList.length > 0 && (
                    <AntButton size="small" style={{ marginTop: 8 }} onClick={() => handleFileChange({ fileList: [] })}>
                      Quitar archivo elegido
                    </AntButton>
                  )}
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
                  {disableYoutubeInput && (
                    <AntAlert
                      type="info"
                      showIcon
                      style={{ marginTop: 8 }}
                      message="Este campo está bloqueado porque ya elegiste un archivo de video. Tocá «Quitar archivo elegido» en la otra pestaña si preferís usar YouTube."
                    />
                  )}
                </GridItem>
                {iframeUrl && (
                  <GridItem colSpan={{ base: 1, md: 2 }}>
                    <div style={{ position: 'relative', paddingTop: '56.25%', width: '100%', marginTop: '1rem', background: 'var(--gray-100)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
  <YoutubeEmbed valor={iframeUrl} />
</div>
                    </div>
                  </GridItem>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </GridItem>
        <GridItem colSpan={{ base: 1, md: 1 }}>
          <FormControl isRequired>
            <FormLabel>Patologías</FormLabel>
            {/* SELECT DE LAS PATOLOGIAS */}
            <Select
              name="idPatologias"
              {...sharedProps}
              /* value={alumnos} */
              onChange={handleChangeSelectInsert}
            />
          </FormControl>
        </GridItem>
        <GridItem colSpan={{ base: 1, md: 1 }}>
          <FormControl isRequired>
            <FormLabel>Categorías</FormLabel>
            {/* SELECT DE LAS CATEGORIAS */}
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
              value={informacionToInsert?.tipoContenido || "video"}
              onChange={(value) => handleChangeInputInsert({ target: { name: "tipoContenido", value } })}
              options={[
                { label: "Video", value: "video" },
                { label: "Infografia", value: "infografia" },
                { label: "Ambos", value: "ambos" },
              ]}
            />
          </FormControl>
        </GridItem>

        {(informacionToInsert?.tipoContenido === "infografia" || informacionToInsert?.tipoContenido === "ambos") && (
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
                value={informacionToInsert?.urlInfografia ? informacionToInsert.urlInfografia : ""}
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
                informacionToInsert?.descripcion
                  ? informacionToInsert.descripcion
                  : ""
              }
              onChange={(e) => handleChangeInputInsert(e)}
            />
            <FormLabel>Descripción</FormLabel>
          </FormControl>
        </GridItem>
      </Grid>

      <div style={{ textAlign: "center" }}>
        <Button
          className="btn_accion_edit_informacion"
          colorScheme="blue"
          style={{ margin: "1rem auto 0" }}
          onClick={() => setShowVentEmergenteConfirmacion(true)}
          isLoading={loadingAction}
          isDisabled={!bandInsert}
        >
          Guardar información
        </Button>
        {!bandInsert && (
          <p style={{ fontSize: 13, color: "var(--gray-500)", marginTop: 6 }}>Completá los campos obligatorios (nombre, descripción y video) para poder guardar.</p>
        )}
      </div>

      {/* <VentEmergConfirmacion
        onClosePadre={onClosePadre}
        onClose={handleCloseVentEmergente}
        mje={"Esta seguro de agregar a la informacion? "}
        handleSi={handleInsert}
        isOpen={showVentEmergenteConfirmacion}
      /> */}
      <VentEmergConfirmacion
        onClosePadre={onClosePadre}
        onClose={handleCloseVentEmergente}
        title={`¿Publicar la información «${informacionToInsert?.nombre || ""}»?`}
        mje="La van a ver en la sección Información los pacientes con las patologías que elegiste (o todos, si no elegiste ninguna)."
        confirmText="Publicar información"
        errorFallback="No pudimos guardar los cambios"
        handleSi={handleInsertWithVideo}
        isOpen={showVentEmergenteConfirmacion}
      />
    </div>
  );
};
