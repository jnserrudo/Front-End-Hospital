import {
  Button,
  ButtonGroup,
  Textarea,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { Space, Upload,Select } from "antd";
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

  const navigate = useNavigate();
  const handleShowConsulta = (ndocu) => {
    navigate("/informacion/" + ndocu);
  };

  const [bandEdit, setBandEdit] = useState(false);
  const [bandUpdated, setBandUpdated] = useState(false);
  const [showVentEmergenteConfirmacion, setShowVentEmergenteConfirmacion] =
    useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

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

  const [opcionesPatologias, setOpcionesPatologias] = useState([])
  const {
    handleChangeInput,
    handleUpdate,
    handleChangeSelect,
    patologiasxInformacionEdit,
  } = useContext(InformacionsContext);
  if (!informacion) {
    return null;
  }

  

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
    if (!previewUrl) {
      setPreviewUrl(entorno.slice(0, -4) + informacion.urlVideo);
    }
  }, [informacion]);

  useEffect(() => {
    console.log(patologiasxInformacionEdit)
    if (patologiasxInformacionEdit && Object.values(patologiasxInformacionEdit).length > 0) {
      setPatologiasAsociadas(patologiasxInformacionEdit.patologiasAsociadas);
      setPatologiasNoAsociadas(
        patologiasxInformacionEdit.patologiasNoAsociadas
      );
      setSelectedPatologias(
        patologiasxInformacionEdit.patologiasAsociadas.map((p) => p.id)
      );
    }
  }, [patologiasxInformacionEdit]);

  
  useEffect(()=>{
    if(patologiasAsociadas.length>0 || patologiasNoAsociadas.length>0 ){
      
      console.log("patologiasAsociadas,patologiasNoAsociadas: ",patologiasAsociadas,patologiasNoAsociadas)
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
      ])
    }
  },[patologiasAsociadas,patologiasNoAsociadas])

  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      const file = newFileList[0].originFileObj;
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
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
            value={informacion.nombre ? informacion.nombre : ""}
            onChange={(e) => handleChangeInput(e)}
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
        {/* SELECT DE LAS PATOLOGIAS */}
        <Select
          disabled={!bandEdit}
          name="idPatologias"
          className="select_recetas input_edit"
          {...sharedProps}
          /* value={alumnos} */
          onChange={handleChangeSelect}
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
            value={informacion.descripcion ? informacion.descripcion : ""}
            onChange={(e) => handleChangeInput(e)}
          />
          <FormLabel>Descripción</FormLabel>
        </FormControl>
      </div>

      <div className="cont_btns_acciones_informacion">
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
