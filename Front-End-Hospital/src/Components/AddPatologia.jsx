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
          <FormControl
            className="cont_input_edit"
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
              value={patologiaToInsert?.nombre ? patologiaToInsert.nombre : ""}
              onChange={(e) => handleChangeInputInsert(e)}
            />
            <FormLabel>Nombre</FormLabel>
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
                patologiaToInsert?.descripcion
                  ? patologiaToInsert.descripcion
                  : ""
              }
              onChange={(e) => handleChangeInputInsert(e)}
            />
            <FormLabel>Descripción</FormLabel>
          </FormControl>
        </GridItem>
      </Grid>

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
