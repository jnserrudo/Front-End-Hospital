import {
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Textarea,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import "../style.css";
import { Select, Space, Tooltip, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import {
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
} from "@chakra-ui/react";
import RecetasContext from "../Contexts/RecetaContext";
import { useNavigate } from "react-router-dom";
import { Input } from "@chakra-ui/react";
import { getPatologiaToRecetaEdit } from "../services/recetas-services";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import { entorno } from "../services/config";

export const EditReceta = ({ receta, onCloseEdit }) => {
  console.log("edit receta: ", receta, entorno.slice(0, -4) + receta.urlFoto);

  const navigate = useNavigate();
  const handleShowConsulta = (ndocu) => {
    navigate("/receta/" + ndocu);
  };

  const [bandEdit, setBandEdit] = useState(false);
  const [bandUpdated, setBandUpdated] = useState(false);
  const [showVentEmergenteConfirmacion, setShowVentEmergenteConfirmacion] =
    useState(false);
  /* ------------------------- */
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

  const [fileList, setFileList] = useState(
    receta.urlFoto
      ? [
          {
            uid: "-1",
            name: "image.png",
            status: "done",
            url: entorno.slice(0, -4) + receta.urlFoto,
          },
        ]
      : []
  );

  const {
    handleChangeInput,
    handleUpdate,
    patologiasxRecetasEdit,
    categoriasxRecetasEdit,
    handleChangeSelect,
    handleChangeSelectCategorias,
  } = useContext(RecetasContext);
  if (!receta) {
    return null;
  }

  const renderOrderedList = (text, desordenada = false) => {
    if (text) {
      return (
        <>
          {desordenada ? (
            <UnorderedList
              margin="0.2rem"
              styleType="'-'"
              /* width="250px"
              height="200px"
 */
              overflowY={text.split("\n").length > 5 ? "scroll" : "hidden"}
              border="1px white black"
              paddingLeft="20px"
              paddingTop={"2rem"}
            >
              {text.split("\n").map((line, index) => (
                <ListItem style={{ textAlign: "justify" }} key={index}>
                  {line}
                </ListItem>
              ))}
            </UnorderedList>
          ) : (
            <OrderedList
              margin="0.2rem"
              /* width="250px"
              height="200px"*/
              overflowY={text.split("\n").length > 5 ? "scroll" : "hidden"}
              paddingLeft="20px"
              paddingTop={"2rem"}
            >
              {text.split("\n").map((line, index) => (
                <ListItem style={{ textAlign: "justify" }} key={index}>
                  {line}
                </ListItem>
              ))}
            </OrderedList>
          )}
        </>
      );
    }
    return null;
  };

  const handleCloseVentEmergente = async () => {
    setShowVentEmergenteConfirmacion(false);
  };
  /* 
  const opcionesPatologias = [
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
  ];
 */
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

  const handleFileChange = ({ fileList: newFileList }) => {
    console.log("handleFileChange");
    setFileList(newFileList);
  };

  useEffect(() => {
    setFileList(
      receta.urlFoto
        ? [
            {
              uid: "-1",
              name: "image.png",
              status: "done",
              url: entorno.slice(0, -4) + receta.urlFoto,
            },
          ]
        : []
    );
  }, [receta]);

  useEffect(() => {
    console.log("fileList", fileList);
  }, [fileList]);

  useEffect(() => {
    console.log(patologiasxRecetasEdit);
    if (
      patologiasxRecetasEdit &&
      Object.values(patologiasxRecetasEdit).length > 0
    ) {
      setPatologiasAsociadas(patologiasxRecetasEdit.patologiasAsociadas);
      setPatologiasNoAsociadas(patologiasxRecetasEdit.patologiasNoAsociadas);
      setSelectedPatologias(
        patologiasxRecetasEdit.patologiasAsociadas.map((p) => p.id)
      );
    }
  }, [patologiasxRecetasEdit]);

  useEffect(() => {
    console.log(categoriasxRecetasEdit);
    if (
      categoriasxRecetasEdit &&
      Object.values(categoriasxRecetasEdit).length > 0
    ) {
      setCategoriasAsociadas(categoriasxRecetasEdit.categoriasAsociadas);
      setCategoriasNoAsociadas(categoriasxRecetasEdit.categoriasNoAsociadas);
      setSelectedCategorias(
        categoriasxRecetasEdit.categoriasAsociadas.map((p) => p.id)
      );
    }
  }, [categoriasxRecetasEdit]);

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

  const handleUpdateWithImage = async () => {
    try {
      let urlFoto;
      if (fileList.length > 0 && fileList[fileList.length - 1].originFileObj) {
        urlFoto = await handleFileUpload(
          fileList[fileList.length - 1].originFileObj
        ); // Usa la última imagen cargada
        console.log(urlFoto);

        handleChangeInput({ target: { name: "urlFoto", value: urlFoto } });
      }
      handleUpdate(
        urlFoto
          ? {
              ...receta,
              urlFoto: urlFoto,
            }
          : receta
      );
    } catch (error) {
      console.error("Error updating recipe:", error);
    }
  };

  useEffect(() => {
    if (patologiasxRecetasEdit && patologiasxRecetasEdit.length > 0) {
      setPatologiasAsociadas(patologiasxRecetasEdit.patologiasAsociadas);
      setPatologiasNoAsociadas(patologiasxRecetasEdit.patologiasNoAsociadas);
      setSelectedPatologias(
        patologiasxRecetasEdit.patologiasAsociadas.map((p) => p.id)
      );
    }
  }, [patologiasxRecetasEdit]); // Dependencia cambiada a patologiasxRecetasEdit

  useEffect(() => {
    if (categoriasxRecetasEdit && categoriasxRecetasEdit.length > 0) {
      setCategoriasAsociadas(categoriasxRecetasEdit.categoriasAsociadas);
      setCategoriasNoAsociadas(categoriasxRecetasEdit.categoriasNoAsociadas);
      setSelectedPatologias(
        categoriasxRecetasEdit.categoriasAsociadas.map((p) => p.id)
      );
    }
  }, [categoriasxRecetasEdit]);

  console.log("viendo al receta: ", receta);
  useEffect(() => {
    setBandUpdated(bandEdit);
  }, [bandEdit]);

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
        <GridItem colSpan={{ base: 1, md: 1 }}>
          <FormControl
            className="cont_input_edit"
            variant="floating"
            id="nombre"
            isRequired
          >
            <Input
              className={`input_floating ${!bandEdit ? "input_disabled" : ""}`}
              label=""
              name="nombre"
              variant="outlined"
              type="text"
              disabled={!bandEdit}
              value={receta.nombre ? receta.nombre : ""}
              onChange={(e) => handleChangeInput(e)}
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
              className={`input_floating ${!bandEdit ? "input_disabled" : ""}`}
              label="Porciones"
              name="porciones"
              variant="outlined"
              type="text"
              disabled={!bandEdit}
              value={receta.porciones ? receta.porciones : ""}
              onChange={(e) => handleChangeInput(e)}
            />
            <FormLabel className="label_floating">Porciones</FormLabel>
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
              placeholder="Calorias"
              name="calorias"
              disabled={!bandEdit}
              variant="outlined"
              type="text"
              value={receta?.calorias ? receta.calorias : ""}
              onChange={(e) => handleChangeInput(e)}
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
              placeholder="Tiempo"
              name="tiempo"
              disabled={!bandEdit}
              variant="outlined"
              type="text"
              value={receta?.tiempo ? receta.tiempo : ""}
              onChange={(e) => handleChangeInput(e)}
            />
            <FormLabel className="label_floating">Tiempo</FormLabel>
          </FormControl>
        </GridItem>
        <GridItem colSpan={{ base: 1, md: 1 }}>
          {/* <Input
          className={`input_edit`}
          placeholder="URL Foto"
          name="urlFoto"
          disabled={!bandEdit}
          variant="outlined"
          type="text"
          value={receta?.urlFoto ? receta.urlFoto : ""}
          onChange={(e) => handleChangeInput(e)}
        /> */}
          <Upload
            className="imgCrop"
            listType="picture-card"
            fileList={fileList}
            onChange={handleFileChange}
            disabled={!bandEdit}
          >
            {/* fileList.length < 2 &&  */ "Imagen/Video"}
          </Upload>
          {/* <ImgCrop rotationSlider>
        </ImgCrop> */}
        </GridItem>
        <GridItem colSpan={{ base: 1, md: 1 }}>
          <FormControl
            className="cont_input_edit"
            variant="floating"
            id="tiempo"
            isRequired
          >
            {bandEdit ? (
              <Textarea
                className={`input_floating`}
                disabled={!bandEdit}
                placeholder="Ingredientes"
                name="ingredientes"
                variant="outlined"
                type="text"
                value={receta?.ingredientes ? receta.ingredientes : ""}
                onChange={(e) => handleChangeInput(e)}
              />
            ) : (
              renderOrderedList(receta.ingredientes)
            )}
            <FormLabel className="label_floating">Ingredientes</FormLabel>
          </FormControl>
        </GridItem>
        <GridItem colSpan={{ base: 1, md: 1 }}>
          <FormControl
            className="cont_input_edit"
            variant="floating"
            id="tipsSaludables"
            isRequired
          >
            {bandEdit ? (
              <Textarea
                className={`input_floating`}
                placeholder=""
                name="tipsSaludables"
                size="sm"
                disabled={!bandEdit}
                variant="outlined"
                type="text"
                value={receta?.tipsSaludables ? receta.tipsSaludables : ""}
                onChange={(e) => handleChangeInput(e)}
              />
            ) : (
              renderOrderedList(receta.tipsSaludables)
            )}

            <FormLabel className="label_floating">Tips Saludables</FormLabel>
          </FormControl>
        </GridItem>
        <GridItem colSpan={{ base: 1, md: 1 }}>
          <FormControl
            className="cont_input_edit"
            variant="floating"
            id="composicionNutricional"
            isRequired
          >
            {bandEdit ? (
              <Textarea
                className={`input_floating`}
                placeholder=""
                name="composicionNutricional"
                size="sm"
                disabled={!bandEdit}
                variant="outlined"
                type="text"
                value={
                  receta?.composicionNutricional
                    ? receta.composicionNutricional
                    : ""
                }
                onChange={(e) => handleChangeInput(e)}
              />
            ) : (
              renderOrderedList(receta.composicionNutricional, true)
            )}

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
            {bandEdit ? (
              <Textarea
                className={`input_floating`}
                placeholder="Preparación"
                disabled={!bandEdit}
                name="preparacion"
                variant="outlined"
                type="text"
                value={receta?.preparacion ? receta.preparacion : ""}
                onChange={(e) => handleChangeInput(e)}
              />
            ) : (
              renderOrderedList(receta.preparacion)
            )}

            <FormLabel className="label_floating">Preparacion</FormLabel>
          </FormControl>
        </GridItem>
        <GridItem colSpan={{ base: 1, md: 2 }}>
          <FormControl isRequired>
            <FormLabel>Patologias</FormLabel>
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
          </FormControl>
        </GridItem>
        <GridItem colSpan={{ base: 1, md: 2 }}>
          <FormControl isRequired>
            <FormLabel>Categorias</FormLabel>
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
          </FormControl>
        </GridItem>
      </Grid>
      <div className="cont_btns_acciones">
        {!bandEdit ? (
          <Button
            className="btn_accion_edit_receta"
            variant="outlined"
            onClick={() => setBandEdit(true)}
          >
            Editar
          </Button>
        ) : (
          <Button
            className="btn_accion_edit_receta"
            variant="contained"
            color="info"
            onClick={() => setBandEdit(false)}
          >
            Cancelar
          </Button>
        )}

        {bandUpdated ? (
          <Button
            className="btn_accion_edit_receta"
            colorScheme="green"
            /*            variant="contained"
            style={{ margin: "1rem auto 0" }}
 */ onClick={() => setShowVentEmergenteConfirmacion(true)}
          >
            Actualizar
          </Button>
        ) : null}
      </div>

      <VentEmergConfirmacion
        onClosePadre={onCloseEdit}
        onClose={handleCloseVentEmergente}
        mje={
          "Esta seguro de actualizar los datos del receta " +
          /*  receta?.nombre?.toUpperCase() +
          ", " +
          receta?.apellido?.toUpperCase() + */
          " ?"
        }
        /* handleSi={() => handleUpdate(receta)} */
        handleSi={handleUpdateWithImage}
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
