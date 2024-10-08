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

import UsuariosContext from "../Contexts/UsuarioContext";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import { Input } from "@chakra-ui/react";
import { getPatologiaToRecetaAdd } from "../services/recetas-services";
import toast, { Toaster } from "react-hot-toast";
export const AddUsuario = ({ onClosePadre }) => {
  const {
    usuarioToInsert,
    handleChangeInputInsert,
    handleChangeSelectRolInsert,
    handleChangeSelectInsert,
    bandInsert,
    handleInsert,
    allRolesAdd,
    patologiasToUsuarioAdd,
    handleCloseVentEmergConfirmacion,
  } = useContext(UsuariosContext);

  const sharedPropsRoles = {
    /* mode: "multiple", */
    style: {
      width: "100%",
    },
    options: allRolesAdd,
    placeholder: "Seleccione un Rol",
    maxTagCount: "responsive",
  };

  const sharedProps = {
    mode: "multiple",
    style: {
      width: "100%",
    },
    options: patologiasToUsuarioAdd,
    placeholder: "Seleccione una Patología",
    maxTagCount: "responsive",
  };

  const [showVentEmergenteConfirmacion, setShowVentEmergenteConfirmacion] =
    useState(false);

  const handleCloseVentEmergente = async () => {
    setShowVentEmergenteConfirmacion(false);
  };

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
              className={`input_floating`}
              placeholder=""
              name="nombre"
              variant="outlined"
              type="text"
              value={usuarioToInsert?.nombre ? usuarioToInsert.nombre : ""}
              onChange={(e) => handleChangeInputInsert(e)}
            />
            <FormLabel className="label_floating">Nombre</FormLabel>
          </FormControl>
        </GridItem>
        <GridItem colSpan={{ base: 1, md: 2 }}>
          <FormControl
            className="cont_input_edit_large"
            variant="floating"
            id="dni"
            isRequired
          >
            <Input
              className={`input_floating`}
              placeholder=""
              name="apellido"
              variant="outlined"
              type="text"
              value={usuarioToInsert?.apellido ? usuarioToInsert.apellido : ""}
              onChange={(e) => handleChangeInputInsert(e)}
            />
            <FormLabel className="label_floating">Apellido</FormLabel>
          </FormControl>
        </GridItem>
        <GridItem colSpan={{ base: 1, md: 1 }}>
          <FormControl
            className="cont_input_edit"
            variant="floating"
            id="apellido"
            isRequired
          >
            <Input
              className={`input_floating`}
              placeholder=""
              name="dni"
              variant="outlined"
              type="number"
              value={usuarioToInsert?.dni ? usuarioToInsert.dni : ""}
              onChange={(e) => handleChangeInputInsert(e)}
            />
            <FormLabel className="label_floating">
              Documento de identidad
            </FormLabel>
          </FormControl>
        </GridItem>
        <GridItem colSpan={{ base: 1, md: 1 }}>
          <FormControl
            className="cont_input_edit"
            variant="floating"
            id="usuario"
            isRequired
          >
            <Input
              className={`input_floating`}
              placeholder=""
              name="usuario"
              variant="outlined"
              type="text"
              value={usuarioToInsert?.usuario ? usuarioToInsert.usuario : ""}
              onChange={(e) => handleChangeInputInsert(e)}
            />
            <FormLabel className="label_floating">Usuario</FormLabel>
          </FormControl>
        </GridItem>
        <GridItem colSpan={{ base: 1, md: 1 }}>
          <FormControl
            className="cont_input_edit"
            variant="floating"
            id="password"
            isRequired
          >
            <Input
              className={`input_floating`}
              placeholder=""
              name="password"
              variant="outlined"
              type="password"
              value={usuarioToInsert?.password ? usuarioToInsert.password : ""}
              onChange={(e) => handleChangeInputInsert(e)}
            />
            <FormLabel className="label_floating">Contraseña</FormLabel>
          </FormControl>
        </GridItem>
        <GridItem colSpan={{ base: 1, md: 1 }}>
          <FormControl
            className="cont_input_edit"
            variant="floating"
            id="email"
            isRequired
          >
            <Input
              className={`input_floating`}
              placeholder=""
              name="email"
              variant="outlined"
              type="email"
              value={usuarioToInsert?.email ? usuarioToInsert.email : ""}
              onChange={(e) => handleChangeInputInsert(e)}
            />
            <FormLabel className="label_floating">Email</FormLabel>
          </FormControl>
        </GridItem>
        <GridItem colSpan={{ base: 1, md: usuarioToInsert.idRol == 3 ? 1 : 2 }}>
          <FormControl isRequired>
            <FormLabel>Rol</FormLabel>
            <Select
              /* className="select_recetas input_edit" */
              name="idRol"
              {...sharedPropsRoles}
              /* value={alumnos} */
              onChange={handleChangeSelectRolInsert}
            />
          </FormControl>
        </GridItem>
        {usuarioToInsert.idRol == 3 ? (
          <GridItem colSpan={{ base: 1, md: 1 }}>
            <FormControl isRequired>
              <FormLabel>Patologia</FormLabel>
              <Select
                /* className="select_recetas input_edit" */
                name="idPatologias"
                {...sharedProps}
                /* value={alumnos} */
                onChange={handleChangeSelectInsert}
              />
            </FormControl>
          </GridItem>
        ) : null}
        <GridItem colSpan={{ base: 1, md: 2 }}>
          <FormControl
            className="cont_input_edit"
            variant="floating"
            id="detalle"
          >
            <Textarea
              className={`input_floating`}
              placeholder=""
              name="detalle"
              size="sm"
              variant="outlined"
              type="text"
              value={usuarioToInsert?.detalle ? usuarioToInsert.detalle : ""}
              onChange={(e) => handleChangeInputInsert(e)}
            />
            <FormLabel>Detalle</FormLabel>
          </FormControl>
        </GridItem>{" "}
      </Grid>
      {bandInsert ? (
        <Button
          className="btn_accion_edit_receta"
          colorScheme="green"
          style={{ margin: "1rem auto 0" }}
          onClick={() => setShowVentEmergenteConfirmacion(true)}
        >
          Agregar Usuario
        </Button>
      ) : null}

      <VentEmergConfirmacion
        onClosePadre={onClosePadre}
        onClose={handleCloseVentEmergente}
        mje={"Esta seguro de agregar al usuario? "}
        /* handleSi={handleInsert} */
        handleSi={() => {
          toast.promise(handleInsert(), {
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
