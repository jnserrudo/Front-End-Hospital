import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Textarea,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import "../style.css";
import PatologiasContext from "../Contexts/PatologiaContext";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import { Input } from "@chakra-ui/react";
export const AddPatologia = ({ onClosePadre }) => {
  const {
    patologiaToInsert,
    handleChangeInputInsert,
    addPatologia,
    bandInsert,
    handleInsert,
    handleCloseVentEmergConfirmacion,
  } = useContext(PatologiasContext);

  const [showVentEmergenteConfirmacion, setShowVentEmergenteConfirmacion] =
    useState(false);
  const handleCloseVentEmergente = async () => {
    setShowVentEmergenteConfirmacion(false);
  };
  return (
    <div className="form_edit_patologia">
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
            value={patologiaToInsert?.nombre ? patologiaToInsert.nombre : ""}
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
              patologiaToInsert?.descripcion
                ? patologiaToInsert.descripcion
                : ""
            }
            onChange={(e) => handleChangeInputInsert(e)}
          />
          <FormLabel>Descripción</FormLabel>
        </FormControl>
      </div>

      {bandInsert ? (
        <Button
          className="btn_accion_edit_patologia"
          colorScheme="green"
          style={{ margin: "1rem auto 0" }}
          onClick={() => setShowVentEmergenteConfirmacion(true)}
        >
          Agregar Patologia
        </Button>
      ) : null}

      <VentEmergConfirmacion
        onClosePadre={onClosePadre}
        onClose={handleCloseVentEmergente}
        mje={"Esta seguro de agregar a la patologia? "}
        handleSi={handleInsert}
        isOpen={showVentEmergenteConfirmacion}
      />
    </div>
  );
};
