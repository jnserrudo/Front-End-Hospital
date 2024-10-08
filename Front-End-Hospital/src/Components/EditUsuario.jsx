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

import UsuariosContext from "../Contexts/UsuarioContext";
import { useNavigate } from "react-router-dom";
import { Input } from "@chakra-ui/react";
import { getPatologiaToUsuarioEdit } from "../services/usuario-services";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import toast, { Toaster } from "react-hot-toast";

export const EditUsuario = ({ usuario, onCloseEdit }) => {
  console.log("edit usuario: ", usuario);

  const navigate = useNavigate();

  const [bandEdit, setBandEdit] = useState(false);
  const [bandUpdated, setBandUpdated] = useState(false);
  const [showVentEmergenteConfirmacion, setShowVentEmergenteConfirmacion] =
    useState(false);
  const [patologiasAsociadas, setPatologiasAsociadas] = useState([]);
  const [patologiasNoAsociadas, setPatologiasNoAsociadas] = useState([]);
  const [selectedPatologias, setSelectedPatologias] = useState([]);
  const [opcionesPatologias, setOpcionesPatologias] = useState([]);

  const {
    handleChangeInput,
    handleBlanqueo,
    handleUpdate,
    /* patologiasxUsuariosEdit, */
    allRolesEdit,
    handleChangeSelectRolEdit,
    handleChangeSelectEdit,
    handleChangeSelect,
    patologiasToUsuarioEdit,
  } = useContext(UsuariosContext);
  if (!usuario) {
    return null;
  }

  const handleCloseVentEmergente = async () => {
    setShowVentEmergenteConfirmacion(false);
  };
  /* const opcionesPatologias = [
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
  ]; */

  const sharedPropsRoles = {
    /* mode: "multiple", */
    style: {
      width: "100%",
    },
    options: allRolesEdit,
    placeholder: "Seleccione un Rol",
    maxTagCount: "responsive",
  };

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

  const handleUpdateWithImage = async () => {
    /* try {
      if (fileList.length > 0 && fileList[0].originFileObj) {
        const uploadedImageUrls = await Promise.all(
          fileList.map((file) => handleFileUpload(file.originFileObj))
        );
        const urlFoto = uploadedImageUrls[0]; // Usar la primera URL si solo se permite una imagen

        handleChangeInput({ target: { name: "urlFoto", value: urlFoto } });
      }
      handleUpdate(receta);
    } catch (error) {
      console.error("Error updating recipe:", error);
    } */
  };

  useEffect(() => {
    console.log(patologiasToUsuarioEdit);
    if (
      patologiasToUsuarioEdit &&
      Object.values(patologiasToUsuarioEdit).length > 0
    ) {
      setPatologiasAsociadas(patologiasToUsuarioEdit.patologiasAsociadas);
      setPatologiasNoAsociadas(patologiasToUsuarioEdit.patologiasNoAsociadas);
      setSelectedPatologias(
        patologiasToUsuarioEdit.patologiasAsociadas.map((p) => p.id)
      );
    }
  }, [patologiasToUsuarioEdit]);

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

  console.log("viendo al usuario: ", usuario);
  useEffect(() => {
    setBandUpdated(bandEdit);

    console.log(
      "band edit y usuario blanqueado: ",
      bandEdit,
      usuario.blanqueado
    );
  }, [bandEdit]);

  return (
    <div className="form">
      <Grid
        className="grid_chackra"
        templateColumns={{
          base: "1fr",
          md: "repeat(auto-fit, minmax(300px, 1fr))",
        }}
        gap={10}
      >
        <Toaster position="top-center" reverseOrder={false} />
        <GridItem colSpan={{ base: 1, md: 2 }}>
          <FormControl
            className="cont_input_edit_large"
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
              value={usuario.nombre ? usuario.nombre : ""}
              onChange={(e) => handleChangeInput(e)}
            />
            <FormLabel className="label_floating">Nombre</FormLabel>
          </FormControl>
        </GridItem>
        <GridItem colSpan={{ base: 1, md: 2 }}>
          <FormControl
            className="cont_input_edit_large"
            variant="floating"
            id="apellido"
            isRequired
          >
            <Input
              className={`input_floating`}
              placeholder=""
              name="apellido"
              disabled={!bandEdit}
              variant="outlined"
              type="text"
              value={usuario?.apellido ? usuario.apellido : ""}
              onChange={(e) => handleChangeInput(e)}
            />
            <FormLabel className="label_floating">Apellido</FormLabel>
          </FormControl>
        </GridItem>
        <GridItem colSpan={{ base: 1, md: 2 }}>
          <FormControl
            className="cont_input_edit"
            variant="floating"
            id="dni"
            isRequired
          >
            <Input
              className={`input_floating ${!bandEdit ? "input_disabled" : ""}`}
              label=""
              name="nombre"
              variant="outlined"
              type="text"
              disabled={!bandEdit}
              value={usuario.dni ? usuario.dni : ""}
              onChange={(e) => handleChangeInput(e)}
            />
            <FormLabel className="label_floating">
              Documento de identidad
            </FormLabel>
          </FormControl>
        </GridItem>
        <GridItem colSpan={{ base: 1, md: 2 }}>
          <FormControl
            className="cont_input_edit"
            variant="floating"
            id="tiempo"
            isRequired
          >
            <Input
              className={`input_floating`}
              placeholder=""
              name="usuario"
              disabled={!bandEdit}
              variant="outlined"
              type="text"
              value={usuario?.usuario ? usuario.usuario : ""}
              onChange={(e) => handleChangeInput(e)}
            />
            <FormLabel className="label_floating">Usuario</FormLabel>
          </FormControl>
        </GridItem>
        <GridItem colSpan={{ base: 1, md: 2 }}>
          <FormControl
            className="cont_input_edit"
            variant="floating"
            id="password"
            isRequired
          >
            <Input
              className={`input_floating`}
              disabled={!bandEdit}
              placeholder=""
              name="password"
              variant="outlined"
              type="password"
              value={usuario?.password ? usuario.password : ""}
              onChange={(e) => handleChangeInput(e)}
            />
            <FormLabel className="label_floating">Contraseña</FormLabel>
          </FormControl>
        </GridItem>
        <GridItem colSpan={{ base: 1, md: 2 }}>
          <FormControl
            className="cont_input_edit"
            variant="floating"
            id="email"
            isRequired
          >
            <Input
              className={`input_floating`}
              placeholder=""
              disabled={!bandEdit}
              name="email"
              variant="outlined"
              type="text"
              value={usuario?.email ? usuario.email : ""}
              onChange={(e) => handleChangeInput(e)}
            />
            <FormLabel className="label_floating">Email</FormLabel>
          </FormControl>
        </GridItem>
        <GridItem colSpan={{ base: 1, md: usuario.idRol == 3 ? 1 : 2 }}>
          <FormControl isRequired>
            <FormLabel>Rol</FormLabel>
            <Select
              disabled={!bandEdit}
              name="idRol"
              /*             className="select_recetas input_edit"
               */ {...sharedPropsRoles}
              /* value={alumnos} */
              onChange={handleChangeSelectRolEdit}
            />
          </FormControl>
        </GridItem>
        {usuario.idRol == 3 ? (
          <GridItem colSpan={{ base: 1, md: 1 }}>
            <FormControl isRequired>
              <FormLabel>Patologia</FormLabel>
              <Select
                disabled={!bandEdit}
                name="idPatologias"
                /* className="select_recetas input_edit" */
                {...sharedProps}
                onChange={(e) => {
                  console.log(e);
                  handleChangeSelectEdit(e);
                  setSelectedPatologias(e);
                }}
              />
            </FormControl>
          </GridItem>
        ) : null}
        <div className="cont_form_input">
          <Button
            className="btn_accion_edit_receta"
            colorScheme="blue"
            style={{ margin: "1rem auto 1rem" }}
            isDisabled={!bandEdit || usuario.blanqueado != 1}
            onClick={() => {
              toast.promise(handleBlanqueo(usuario), {
                loading: "Cargando",
                success: <b>Usuario Blanqueado!</b>,
                error: <b>No se pudo blanquear al Usuario.</b>,
              });
              onCloseEdit();
            }}
          >
            Blanquear Contraseña
          </Button>
        </div>
        <GridItem colSpan={{ base: 1, md: 2 }}>
          <FormControl
            className="cont_input_edit"
            variant="floating"
            id="detalle"
            isRequired
          >
            <Textarea
              className={`input_floating`}
              placeholder=""
              name="detalle"
              size="sm"
              variant="outlined"
              type="text"
              disabled={!bandEdit}
              value={usuario?.detalle ? usuario.detalle : ""}
              onChange={(e) => handleChangeInput(e)}
            />
            <FormLabel className="label_floating">Detalle</FormLabel>
          </FormControl>
        </GridItem>{" "}
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
          "Esta seguro de actualizar los datos del usuario " +
          /*  receta?.nombre?.toUpperCase() +
          ", " +
          receta?.apellido?.toUpperCase() + */
          " ?"
        }
        handleSi={() => handleUpdate(usuario)}
        /*  handleSi={handleUpdateWithImage} */
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
