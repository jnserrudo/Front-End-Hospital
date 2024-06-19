import React, { useContext, useEffect, useState } from "react";
import { Button, ButtonGroup } from "@chakra-ui/react";
import "../style.css";
import { Select, Space, Tooltip } from "antd";

import RecetasContext from "../Contexts/RecetaContext";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import { Input } from "@chakra-ui/react";
import { getPatologiaToRecetaAdd } from "../services/recetas-services";
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
    placeholder: "Seleccione una Receta",
    maxTagCount: "responsive",
  };

  const [showVentEmergenteConfirmacion, setShowVentEmergenteConfirmacion] =
  useState(false);
const handleCloseVentEmergente = async () => {
  setShowVentEmergenteConfirmacion(false);
};

  
  return (
    <div className="form_edit_receta">
      <div className="cont_input_edit">
        <Input
          className={`input_edit`}
          placeholder="Nombre"
          name="nombre"
          variant="outlined"
          type="text"
          value={recetaToInsert?.nombre ? recetaToInsert.nombre : ""}
          onChange={(e) => handleChangeInputInsert(e)}
        />
        <Input
          className={`input_edit`}
          placeholder="Porciones"
          name="porciones"
          variant="outlined"
          type="text"
          value={recetaToInsert?.porciones ? recetaToInsert.porciones : ""}
          onChange={(e) => handleChangeInputInsert(e)}
        />
      </div>

      <div className="cont_input_edit">
        <Input
          className={`input_edit`}
          placeholder="Calorias"
          name="calorias"
          variant="outlined"
          type="text"
          value={recetaToInsert?.calorias ? recetaToInsert.calorias : ""}
          onChange={(e) => handleChangeInputInsert(e)}
        />
        <Input
          className={`input_edit`}
          placeholder="Tiempo"
          name="tiempo"
          variant="outlined"
          type="text"
          value={recetaToInsert?.tiempo ? recetaToInsert.tiempo : ""}
          onChange={(e) => handleChangeInputInsert(e)}
        />
      </div>

      <div className="cont_input_edit">
        <Input
          className={`input_edit`}
          placeholder="URL Foto"
          name="urlFoto"
          variant="outlined"
          type="text"
          value={recetaToInsert?.urlFoto ? recetaToInsert.urlFoto : ""}
          onChange={(e) => handleChangeInputInsert(e)}
        />
        <Input
          className={`input_edit`}
          placeholder="Ingredientes"
          name="ingredientes"
          variant="outlined"
          type="text"
          value={recetaToInsert?.ingredientes ? recetaToInsert.ingredientes : ""}
          onChange={(e) => handleChangeInputInsert(e)}
        />
      </div>
      <div className="cont_input_edit">
        <Input
          className={`input_edit`}
          placeholder="Preparación"
          name="preparacion"
          variant="outlined"
          type="text"
          value={recetaToInsert?.preparacion ? recetaToInsert.preparacion : ""}
          onChange={(e) => handleChangeInputInsert(e)}
        />
        {/* SELECT DE LAS PATOLOGIAS */}
        <Select
        className="select_recetas input_edit"
        name='idPatologias'
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
        handleSi={handleInsert}
        isOpen={showVentEmergenteConfirmacion}
      />
    </div>
  );
};
