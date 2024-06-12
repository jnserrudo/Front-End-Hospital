import React, { useContext, useEffect, useState } from "react";
import { Button, ButtonGroup } from "@chakra-ui/react";
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
    showVentEmergConfirmacion,
    setShowVentEmergConfirmacion,
    handleCloseVentEmergConfirmacion,
  } = useContext(PatologiasContext);

  
  return (
    <div className="form_edit_patologia">
     
      <div className="cont_input_edit">
        <Input
          className={`input_edit`}
          placeholder="Nombre"
          name="nombre"
          variant="outlined"
          type="text"
          value={patologiaToInsert?.nombre ? patologiaToInsert.nombre : ""}
          onChange={(e) => handleChangeInputInsert(e)}
        />
        <Input
          className={`input_edit`}
          placeholder="Descripcion"
          name="descripcion"
          variant="outlined"
          type="text"
          value={patologiaToInsert?.descripcion ? patologiaToInsert.descripcion : ""}
          onChange={(e) => handleChangeInputInsert(e)}
        />
      </div>

      {bandInsert ? (
        <Button
          className="btn_accion_edit_patologia"
          colorScheme="green"
          style={{ margin: "1rem auto 0" }}
          onClick={() => setShowVentEmergConfirmacion(true)}
        >
          Agregar Patologia
        </Button>
      ) : null}

      <VentEmergConfirmacion
        onClosePadre={onClosePadre}
        onClose={handleCloseVentEmergConfirmacion}
        mje={"Esta seguro de agregar a la patologia? "}
        handleSi={handleInsert}
        isOpen={showVentEmergConfirmacion}
      />
    </div>
  );
};
