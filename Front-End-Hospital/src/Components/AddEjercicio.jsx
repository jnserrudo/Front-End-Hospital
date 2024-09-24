import React, { useContext, useEffect, useState } from "react";
import { Tabs, Tab, TabList, TabPanel, TabPanels } from "@chakra-ui/react";

import {
  Button,
  ButtonGroup,
  Textarea,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import "../style.css";
import EjerciciosContext from "../Contexts/EjercicioContext";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import { Input } from "@chakra-ui/react";
import ReactPlayer from "react-player";
import { Toaster } from "react-hot-toast";

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
  const handleInsertWithVideo = async () => {
    try {
      let urlVideo = "";
      // Indicar que se debe insertar la información después de cargar la URL del video
      if (useYoutube && youtubeUrl) {
        // Si se está utilizando la URL de YouTube
        urlVideo = youtubeUrl;
      } else if (fileList.length > 0) {
        const uploadedVideoUrls = await Promise.all(
          fileList.map((file) => handleFileUpload(file.originFileObj))
        );
        urlVideo = uploadedVideoUrls[0]; // Usar la primera URL si solo se permite un video
      }

      handleChangeInputInsert({
        target: { name: "urlVideo", value: urlVideo },
      });
    } catch (error) {
      console.error("Error inserting ejercicio:", error);
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
    <div className="">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="form_edit_informacion">
        <FormControl
          className="cont_input_edit"
          variant="floating"
          id="nombre"
          isRequired
        >
          <Input
            className={`input_edit`}
            placeholder=""
            name="nombre"
            variant="outlined"
            type="text"
            value={ejercicioToInsert?.nombre ? ejercicioToInsert.nombre : ""}
            onChange={(e) => handleChangeInputInsert(e)}
          />
          <FormLabel>Nombre</FormLabel>
        </FormControl>

        <Tabs>
          <TabList>
            <Tab>Cargar Video</Tab>
            <Tab>Youtube</Tab>
          </TabList>
          <TabPanels>
            <TabPanel className="tab_video_iframe">
              {previewUrl && (
                <ReactPlayer
                  width="60%"
                  height="100%"
                  controls
                  url={previewUrl}
                />
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
                      `<img src="${preview}" alt="preview" />`
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
            </TabPanel>
            <TabPanel>
              <FormControl
                className="cont_input_edit"
                variant="floating"
                id="youtubeUrl"
              >
                <Textarea
                  className={`input_edit `}
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
              {iframeUrl && (
                <div style={{ marginTop: "1rem" }}>
                  <div dangerouslySetInnerHTML={{ __html: iframeUrl.replace("<iframe", "<iframe style='width: 100%; height: 100%; border: none;'") }} />
                </div>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
        {/* SELECT DE LAS PATOLOGIAS */}
        <Select
          className="select_recetas input_edit"
          name="idPatologias"
          {...sharedProps}
          /* value={alumnos} */
          onChange={handleChangeSelectInsert}
        />


        {/* SELECT DE LAS CATEGORIAS */}
        <Select
          className="select_recetas input_edit"
          name="idCategorias"
          {...sharedPropsCategorias}
          /* value={alumnos} */
          onChange={handleChangeSelectCategoriasInsert}
        />

        <FormControl
          className="cont_input_edit"
          variant="floating"
          id="descripcion"
          isRequired
        >
          <Textarea
            className={`input_edit`}
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
          <FormLabel>Descripción</FormLabel>
        </FormControl>
      </div>

      {bandInsert ? (
        <Button
          className="btn_accion_edit_ejercicio"
          colorScheme="green"
          style={{ margin: "1rem auto 0" }}
          onClick={() => setShowVentEmergenteConfirmacion(true)}
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
