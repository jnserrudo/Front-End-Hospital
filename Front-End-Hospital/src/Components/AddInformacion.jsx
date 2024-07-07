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
export const AddInformacion = ({ onClosePadre }) => {
  const {
    informacionToInsert,
    handleChangeInputInsert,
    addInformacion,
    bandInsert,
    handleInsert,
    handleCloseVentEmergConfirmacion,
  } = useContext(InformacionsContext);

  const [showVentEmergenteConfirmacion, setShowVentEmergenteConfirmacion] =
    useState(false);
  const handleCloseVentEmergente = async () => {
    setShowVentEmergenteConfirmacion(false);
  };
  return (
    <div className="form_edit_informacion">
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
            value={informacionToInsert?.nombre ? informacionToInsert.nombre : ""}
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

      <VentEmergConfirmacion
        onClosePadre={onClosePadre}
        onClose={handleCloseVentEmergente}
        mje={"Esta seguro de agregar a la informacion? "}
        handleSi={handleInsert}
        isOpen={showVentEmergenteConfirmacion}
      />
    </div>
  );
};
