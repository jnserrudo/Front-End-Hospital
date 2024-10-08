import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Textarea,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import "../style.css";
import { Select, Space, Tooltip, Upload } from "antd";
import ImgCrop from "antd-img-crop";

import RecetasContext from "../Contexts/RecetaContext";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import { Input } from "@chakra-ui/react";
import { getPatologiaToRecetaAdd } from "../services/recetas-services";
import { entorno } from "../services/config";
import toast, { Toaster } from "react-hot-toast";

export const AddReceta = ({ onClosePadre }) => {
  const {
    recetaToInsert,
    handleChangeInputInsert,
    handleChangeSelectInsert,
    handleChangeSelectCategoriasInsert,
    addReceta,
    bandInsert,
    handleInsert,
    handleCloseVentEmergConfirmacion,
    patologiasxRecetasAdd,
    categoriasxRecetasAdd,
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

  const sharedPropsCategorias = {
    mode: "multiple",
    style: {
      width: "100%",
    },
    options: categoriasxRecetasAdd,
    placeholder: "Seleccione una Categoría",
    maxTagCount: "responsive",
  };

  const [showVentEmergenteConfirmacion, setShowVentEmergenteConfirmacion] =
    useState(false);

  const [fileList, setFileList] = useState([]);

  const [shouldInsert, setShouldInsert] = useState(false);

  useEffect(() => {
    if (shouldInsert) {
      toast.promise(handleInsert(), {
        loading: "Cargando",
        success: <b>Se agrego la receta!</b>,
        error: <b>No se pudo agregar la receta.</b>,
      });
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
    <div className="form">
      <Toaster position="top-center" reverseOrder={false} />
      <Grid
        className="grid_chackra"
        templateColumns={{
          base: "1fr",
          md: "repeat(auto-fit, minmax(300px, 1fr))",
        }}
        gap={10}
      >
        <GridItem colSpan={{ base: 1, md: 1 }}>
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
              value={recetaToInsert?.nombre ? recetaToInsert.nombre : ""}
              onChange={(e) => handleChangeInputInsert(e)}
            />
            <FormLabel className="label_floating">Nombre</FormLabel>
          </FormControl>
        </GridItem>
        <GridItem colSpan={{ base: 1, md: 1 }}>
          <FormControl
            className="cont_input_edit"
            variant="floating"
            id="porciones"
            isRequired
          >
            <Input
              className={`input_floating`}
              placeholder=""
              name="porciones"
              variant="outlined"
              type="text"
              value={recetaToInsert?.porciones ? recetaToInsert.porciones : ""}
              onChange={(e) => handleChangeInputInsert(e)}
            />
            <FormLabel className="label_floating">Porciones</FormLabel>
          </FormControl>
        </GridItem>
        <GridItem colSpan={{ base: 1, md: 1 }}>
          <FormControl
            className="cont_input_edit"
            variant="floating"
            id="calorias"
            isRequired
          >
            <Input
              className={`input_floating`}
              placeholder=""
              name="calorias"
              variant="outlined"
              type="text"
              value={recetaToInsert?.calorias ? recetaToInsert.calorias : ""}
              onChange={(e) => handleChangeInputInsert(e)}
            />
            <FormLabel className="label_floating">Calorias</FormLabel>
          </FormControl>
        </GridItem>
        <GridItem colSpan={{ base: 1, md: 1 }}>
          <FormControl
            className="cont_input_edit"
            variant="floating"
            id="tiempo"
            isRequired
          >
            <Input
              className={`input_floating`}
              placeholder=""
              name="tiempo"
              variant="outlined"
              type="text"
              value={recetaToInsert?.tiempo ? recetaToInsert.tiempo : ""}
              onChange={(e) => handleChangeInputInsert(e)}
            />
            <FormLabel className="label_floating">Tiempo</FormLabel>
          </FormControl>
        </GridItem>
        <GridItem colSpan={{ base: 1, md: 1 }}>
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
        </GridItem>
        <GridItem colSpan={{ base: 1, md: 1 }}>
          <FormControl
            className="cont_input_edit"
            variant="floating"
            id="ingredientes"
            isRequired
          >
            <Textarea
              className={`input_floating`}
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
            <FormLabel className="label_floating">Ingredientes</FormLabel>
          </FormControl>
        </GridItem>
        <GridItem colSpan={{ base: 1, md: 1 }}>
          <FormControl
            className="cont_input_edit"
            variant="floating"
            id="tipsSaludables"
          >
            <Textarea
              className={`input_floating`}
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
            <FormLabel className="label_floating">Tips Saludables</FormLabel>
          </FormControl>
        </GridItem>
        <GridItem colSpan={{ base: 1, md: 1 }}>
          <FormControl
            className="cont_input_edit"
            variant="floating"
            id="composicionNutricional"
          >
            <Textarea
              className={`input_floating`}
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
            <FormLabel className="label_floating">
              Composición Nutricional
            </FormLabel>
          </FormControl>
        </GridItem>
        <GridItem colSpan={{ base: 1, md: 2 }}>
          <FormControl
            className="cont_input_edit"
            variant="floating"
            id="preparacion"
            isRequired
          >
            <Textarea
              className={`input_floating`}
              placeholder=""
              name="preparacion"
              variant="outlined"
              type="text"
              value={
                recetaToInsert?.preparacion ? recetaToInsert.preparacion : ""
              }
              onChange={(e) => handleChangeInputInsert(e)}
            />
            <FormLabel className="label_floating">Preparacion</FormLabel>
          </FormControl>
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
      </Grid>
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
        handleSi={() => {
          toast.promise(handleInsertWithImage, {
            loading: "Cargando",
            success: <b>Se agrego el usuario!</b>,
            error: <b>No se pudo agregar al Usuario.</b>,
          });

          //toast.success("Se agrego el usuario!")
        }}
        isOpen={showVentEmergenteConfirmacion}
      />
    </div>
  );
};
