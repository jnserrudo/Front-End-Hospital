import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Textarea,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
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
    handleChangeSelectTiposInsert,
  } = useContext(CategoriasContext);

  const sharedPropsCategorias = {
    style: {
      width: "100%",
    },
    options: [
      {
        value: 1,
        label: "Ejercicio",
      },
      {
        value: 2,
        label: "Información",
      },
      {
        value: 3,
        label: "Recetas",
      },
    ],
    placeholder: "Elegí un tipo",
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
        <GridItem colSpan={{ base: 1, md: 2 }}>
          <FormControl isRequired>
            <Input
              className="input_floating"
              placeholder=" "
              name="nombre"
              variant={"outlined"}
              type="text"
              value={categoriaToInsert?.nombre ? categoriaToInsert.nombre : ""}
              onChange={(e) => handleChangeInputInsert(e)}
            />
            <FormLabel className="label_floating">Nombre</FormLabel>
          </FormControl>
        </GridItem>

        <GridItem colSpan={{ base: 1, md: 2 }}>
          <FormControl
            className="cont_input_edit"
            variant="floating"
            id="descripcion"
            isRequired
          >
            <Textarea
              className={`input_floating`}
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
            <FormLabel className="label_floating">Descripción</FormLabel>
          </FormControl>
        </GridItem>

        <GridItem colSpan={{ base: 1, md: 2 }}>
          <FormControl isRequired>
            <FormLabel>Tipo</FormLabel>
            <Select
              name="idTipos"
              {...sharedPropsCategorias}
              /* value={alumnos} */
              onChange={handleChangeSelectTiposInsert}
            />
          </FormControl>
        </GridItem>
      </Grid>

      <div style={{ textAlign: "center" }}>
        <Button
          className="btn_accion_edit_categoria"
          colorScheme="blue"
          style={{ margin: "1rem auto 0" }}
          onClick={() => setShowVentEmergenteConfirmacion(true)}
          isDisabled={!bandInsert}
        >
          Guardar categoría
        </Button>
        {!bandInsert && (
          <p style={{ fontSize: 13, color: "var(--gray-500)", marginTop: 6 }}>Completá el nombre, la descripción y el tipo para poder guardar.</p>
        )}
      </div>

      <VentEmergConfirmacion
        onClosePadre={onClosePadre}
        onClose={handleCloseVentEmergente}
        title={`¿Crear la categoría «${categoriaToInsert?.nombre || ""}»?`}
        mje="Va a quedar disponible para clasificar recetas, ejercicios e información."
        confirmText="Crear categoría"
        errorFallback="No pudimos guardar los cambios"
        handleSi={handleInsert}
        isOpen={showVentEmergenteConfirmacion}
      />
    </div>
  );
};
