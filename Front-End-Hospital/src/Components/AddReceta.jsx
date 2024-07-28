import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Textarea,
} from "@chakra-ui/react";
import "../style.css";
import { Select, Space, Tooltip, Upload } from "antd";
import ImgCrop from "antd-img-crop";

import RecetasContext from "../Contexts/RecetaContext";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import { Input } from "@chakra-ui/react";
import { getPatologiaToRecetaAdd } from "../services/recetas-services";
import { entorno } from "../services/config";
export const AddReceta = ({ onClosePadre }) => {
  const {
    recetaToInsert,
    handleChangeInputInsert,
    handleChangeSelectInsert,
    addReceta,
    bandInsert,
    handleInsert,
    handleCloseVentEmergConfirmacion,
    patologiasxRecetasAdd,
  } = useContext(RecetasContext);

  const sharedProps = {
    mode: "multiple",
    style: {
      width: "100%",
    },
    options: patologiasxRecetasAdd,
    placeholder: "Seleccione una Patología",
    maxTagCount: "responsive",
  };

  const [showVentEmergenteConfirmacion, setShowVentEmergenteConfirmacion] =
    useState(false);

  const [fileList, setFileList] = useState([]);

  const [shouldInsert, setShouldInsert] = useState(false);

  useEffect(() => {
    if (shouldInsert) {
      handleInsert();
      setShouldInsert(false); // Reiniciar el estado para futuras inserciones
    }
  }, [shouldInsert, handleInsert]);

  const handleCloseVentEmergente = async () => {
    setShowVentEmergenteConfirmacion(false);
  };

  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(entorno + "/recetas/upload/files", {
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

  const beforeUpload = (file) => {
    const isJpgOrPng =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/jpg";
    if (!isJpgOrPng) {
      console.error("Solo se permiten archivos de imagen (jpeg, jpg, png)");
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const handleInsertWithImage = async () => {
    try {
      const uploadedImageUrls = await Promise.all(
        fileList.map((file) => handleFileUpload(file.originFileObj))
      );

      console.log(uploadedImageUrls);
      const urlFoto = uploadedImageUrls[0]; // Usar la primera URL si solo se permite una imagen

      handleChangeInputInsert({ target: { name: "urlFoto", value: urlFoto } });
      // Indicar que se debe insertar la receta después de actualizar el estado
      setShouldInsert(true);
    } catch (error) {
      console.error("Error inserting recipe:", error);
    }
  };

  return (
    <div className="form_edit_receta">
      <div className="cont_form_input">
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
            value={recetaToInsert?.nombre ? recetaToInsert.nombre : ""}
            onChange={(e) => handleChangeInputInsert(e)}
          />
          <FormLabel>Nombre</FormLabel>
        </FormControl>
        <FormControl
          className="cont_input_edit"
          variant="floating"
          id="porciones"
          isRequired
        >
          <Input
            className={`input_edit`}
            placeholder=""
            name="porciones"
            variant="outlined"
            type="text"
            value={recetaToInsert?.porciones ? recetaToInsert.porciones : ""}
            onChange={(e) => handleChangeInputInsert(e)}
          />
          <FormLabel>Porciones</FormLabel>
        </FormControl>
      </div>

      <div className="cont_form_input">
        <FormControl
          className="cont_input_edit"
          variant="floating"
          id="calorias"
          isRequired
        >
          <Input
            className={`input_edit`}
            placeholder=""
            name="calorias"
            variant="outlined"
            type="text"
            value={recetaToInsert?.calorias ? recetaToInsert.calorias : ""}
            onChange={(e) => handleChangeInputInsert(e)}
          />
          <FormLabel>Calorias</FormLabel>
        </FormControl>
        <FormControl
          className="cont_input_edit"
          variant="floating"
          id="tiempo"
          isRequired
        >
          <Input
            className={`input_edit`}
            placeholder=""
            name="tiempo"
            variant="outlined"
            type="text"
            value={recetaToInsert?.tiempo ? recetaToInsert.tiempo : ""}
            onChange={(e) => handleChangeInputInsert(e)}
          />
          <FormLabel>Tiempo</FormLabel>
        </FormControl>
      </div>

      <div className="cont_form_input">
        {/*  <Input
          className={`input_edit`}
          placeholder="URL Foto"
          name="urlFoto"
          variant="outlined"
          type="text"
          value={recetaToInsert?.urlFoto ? recetaToInsert.urlFoto : ""}
          onChange={(e) => handleChangeInputInsert(e)}
        /> */}

          <Upload
            className="imgCrop"
            listType="picture-card"
            fileList={fileList}
            beforeUpload={beforeUpload}
            maxCount={1}
            onChange={handleFileChange}
          >
            {fileList.length < 1 && "Imagen/Video"}
          </Upload>
        {/* <ImgCrop rotationSlider>
        </ImgCrop> */}

        <FormControl
          className="cont_input_edit"
          variant="floating"
          id="ingredientes"
          isRequired
        >
          <Textarea
            className={`input_edit`}
            placeholder=""
            name="ingredientes"
            size="sm"
            variant="outlined"
            type="text"
            value={
              recetaToInsert?.ingredientes ? recetaToInsert.ingredientes : ""
            }
            onChange={(e) => handleChangeInputInsert(e)}
          />
          <FormLabel>Ingredientes</FormLabel>
        </FormControl>
      </div>
      <div className="cont_form_input">
        <FormControl
          className="cont_input_edit"
          variant="floating"
          id="tipsSaludables"
        >
          <Textarea
            className={`input_edit`}
            placeholder=""
            name="tipsSaludables"
            size="sm"
            variant="outlined"
            type="text"
            value={
              recetaToInsert?.tipsSaludables
                ? recetaToInsert.tipsSaludables
                : ""
            }
            onChange={(e) => handleChangeInputInsert(e)}
          />
          <FormLabel>Tips Saludables</FormLabel>
        </FormControl>
        <FormControl
          className="cont_input_edit"
          variant="floating"
          id="composicionNutricional"
        >
          <Textarea
            className={`input_edit`}
            placeholder=""
            name="composicionNutricional"
            size="sm"
            variant="outlined"
            type="text"
            value={
              recetaToInsert?.composicionNutricional
                ? recetaToInsert.composicionNutricional
                : ""
            }
            onChange={(e) => handleChangeInputInsert(e)}
          />
          <FormLabel>Composición Nutricional</FormLabel>
        </FormControl>
      </div>

      <div className="cont_form_input">
        <FormControl
          className="cont_input_edit"
          variant="floating"
          id="preparacion"
          isRequired
        >
          <Textarea
            className={`input_edit`}
            placeholder=""
            name="preparacion"
            variant="outlined"
            type="text"
            value={
              recetaToInsert?.preparacion ? recetaToInsert.preparacion : ""
            }
            onChange={(e) => handleChangeInputInsert(e)}
          />
          <FormLabel>Preparacion</FormLabel>
        </FormControl>
        {/* SELECT DE LAS PATOLOGIAS */}
        <Select
          className="select_recetas input_edit"
          name="idPatologias"
          {...sharedProps}
          /* value={alumnos} */
          onChange={handleChangeSelectInsert}
        />
      </div>

      {bandInsert ? (
        <Button
          className="btn_accion_edit_receta"
          colorScheme="green"
          style={{ margin: "1rem auto 0" }}
          onClick={() => setShowVentEmergenteConfirmacion(true)}
        >
          Agregar Receta
        </Button>
      ) : null}

      <VentEmergConfirmacion
        onClosePadre={onClosePadre}
        onClose={handleCloseVentEmergente}
        mje={"Esta seguro de agregar a la receta? "}
        /* handleSi={handleInsert} */
        handleSi={handleInsertWithImage}
        isOpen={showVentEmergenteConfirmacion}
      />
    </div>
  );
};
