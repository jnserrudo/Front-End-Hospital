import React, { useContext, useEffect, useState } from "react";
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
export const AddEjercicio = ({ onClosePadre }) => {
  const {
    ejercicioToInsert,
    handleChangeInputInsert,
    addEjercicio,
    bandInsert,
    handleInsert,
    handleCloseVentEmergConfirmacion,
  } = useContext(EjerciciosContext);

  const [showVentEmergenteConfirmacion, setShowVentEmergenteConfirmacion] =
    useState(false);
  const handleCloseVentEmergente = async () => {
    setShowVentEmergenteConfirmacion(false);
  };
  return (
    <div className="form_edit_ejercicio">
      <div className="">
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

      <VentEmergConfirmacion
        onClosePadre={onClosePadre}
        onClose={handleCloseVentEmergente}
        mje={"Esta seguro de agregar a la ejercicio? "}
        handleSi={handleInsert}
        isOpen={showVentEmergenteConfirmacion}
      />
    </div>
  );
};
