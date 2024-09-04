import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Textarea,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import "../style.css";
import { Select } from "antd";

import CategoriasContext from "../Contexts/CategoriaContext";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import { Input } from "@chakra-ui/react";
export const AddCategoria = ({ onClosePadre }) => {
  const {
    categoriaToInsert,
    handleChangeInputInsert,
    addCategoria,
    bandInsert,
    handleInsert,
    handleCloseVentEmergConfirmacion,
    handleChangeSelectTiposInsert
  } = useContext(CategoriasContext);


  const sharedPropsCategorias = {
    style: {
      width: "100%",
    },
    options: [
      {
        value:1,
        label:"Ejercicio"
      },{
        value:2,
        label:"Información"
      }
      ,{
        value:3,
        label:"Recetas"
      }
    ],
    placeholder: "Seleccione una Tipo",
    maxTagCount: "responsive",
  };

  const [showVentEmergenteConfirmacion, setShowVentEmergenteConfirmacion] =
    useState(false);
  const handleCloseVentEmergente = async () => {
    setShowVentEmergenteConfirmacion(false);
  };
  return (
    <div className="form_edit_categoria">
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
            value={categoriaToInsert?.nombre ? categoriaToInsert.nombre : ""}
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
              categoriaToInsert?.descripcion
                ? categoriaToInsert.descripcion
                : ""
            }
            onChange={(e) => handleChangeInputInsert(e)}
          />
          <FormLabel>Descripción</FormLabel>
        </FormControl>

        <Select
          className="select_recetas input_edit"
          name="idTipos"
          {...sharedPropsCategorias}
          /* value={alumnos} */
          onChange={handleChangeSelectTiposInsert}
        />

      </div>

      {bandInsert ? (
        <Button
          className="btn_accion_edit_categoria"
          colorScheme="green"
          style={{ margin: "1rem auto 0" }}
          onClick={() => setShowVentEmergenteConfirmacion(true)}
        >
          Agregar Categoria
        </Button>
      ) : null}

      <VentEmergConfirmacion
        onClosePadre={onClosePadre}
        onClose={handleCloseVentEmergente}
        mje={"Esta seguro de agregar a la categoria? "}
        handleSi={handleInsert}
        isOpen={showVentEmergenteConfirmacion}
      />
    </div>
  );
};
