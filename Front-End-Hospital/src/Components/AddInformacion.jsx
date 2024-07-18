import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Textarea,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import "../style.css";
import InformacionsContext from "../Contexts/InformacionContext";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import { Input } from "@chakra-ui/react";
import ReactPlayer from "react-player";

import { Upload, Select } from "antd";
import { entorno } from "../services/config";

export const AddInformacion = ({ onClosePadre }) => {
  const {
    informacionToInsert,
    handleChangeInputInsert,
    addInformacion,
    bandInsert,
    handleInsert,
    handleChangeSelectInsert,
    handleCloseVentEmergConfirmacion,
    patologiasxInformacionAdd
  } = useContext(InformacionsContext);
  const sharedProps = {
    mode: "multiple",
    style: {
      width: "100%",
    },
    options: patologiasxInformacionAdd,
    placeholder: "Seleccione una Patología",
    maxTagCount: "responsive",
  };
  const [showVentEmergenteConfirmacion, setShowVentEmergenteConfirmacion] =
    useState(false);

  const [fileList, setFileList] = useState([]);
  const [shouldInsert, setShouldInsert] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [bandPrueba, setBandPrueba] = useState(false);

  const handleCloseVentEmergente = async () => {
    setShowVentEmergenteConfirmacion(false);
  };

  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      const file = newFileList[0].originFileObj;
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
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
      if (fileList.length > 0) {
        const uploadedVideoUrls = await Promise.all(
          fileList.map((file) => handleFileUpload(file.originFileObj))
        );
        urlVideo = uploadedVideoUrls[0]; // Usar la primera URL si solo se permite un video
      }

      handleChangeInputInsert({
        target: { name: "urlVideo", value: urlVideo },
      });
    } catch (error) {
      console.error("Error inserting informacion:", error);
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
    <div className="">
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
            value={
              informacionToInsert?.nombre ? informacionToInsert.nombre : ""
            }
            onChange={(e) => handleChangeInputInsert(e)}
          />
          <FormLabel>Nombre</FormLabel>
        </FormControl>
        {previewUrl && (
          <ReactPlayer width="60%" height="100%" controls url={previewUrl} />
        )}
        <Upload
          className="imgCrop"
          listType="picture-card"
          fileList={fileList}
          beforeUpload={beforeUpload}
          maxCount={1}
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

        {/* SELECT DE LAS PATOLOGIAS */}
        <Select
          className="select_recetas input_edit"
          name="idPatologias"
          {...sharedProps}
          /* value={alumnos} */
          onChange={handleChangeSelectInsert}
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
              informacionToInsert?.descripcion
                ? informacionToInsert.descripcion
                : ""
            }
            onChange={(e) => handleChangeInputInsert(e)}
          />
          <FormLabel>Descripción</FormLabel>
        </FormControl>
      </div>

      {bandInsert ? (
        <Button
          className="btn_accion_edit_informacion"
          colorScheme="green"
          style={{ margin: "1rem auto 0" }}
          onClick={() => setShowVentEmergenteConfirmacion(true)}
        >
          Agregar Informacion
        </Button>
      ) : null}

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
        mje={"Esta seguro de agregar a la informacion? "}
        handleSi={handleInsertWithVideo}
        isOpen={showVentEmergenteConfirmacion}
      />
    </div>
  );
};
