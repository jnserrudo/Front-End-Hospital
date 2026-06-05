import React, { useContext, useState, useEffect } from "react";
import { Button, FormControl, FormLabel, Grid, GridItem, Textarea } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { Select, Space } from "antd";
import CalendarioContext from "../Contexts/CalendarioContext";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";

const TIPOS_EVENTO = [
  { value: "general", label: "General" },
  { value: "patologia", label: "Por Patología" },
];

export const EditEvento = ({ evento, onCloseEdit }) => {
  const { handleChangeInput, handleChangeSelectTipo, handleUpdate } = useContext(CalendarioContext);
  const [bandEdit, setBandEdit] = useState(false);
  const [showVentEmergenteConfirmacion, setShowVentEmergenteConfirmacion] = useState(false);

  if (!evento) {
    return null;
  }

  const handleConfirmar = () => {
    if (bandEdit) {
      setShowVentEmergenteConfirmacion(true);
    }
  };

  useEffect(() => {
    setBandEdit(true);
  }, [evento]);

  return (
    <div className="form_edit_receta">
      <Grid
        className="grid_chackra"
        templateColumns={{ base: "1fr", md: "repeat(auto-fit, minmax(300px, 1fr))" }}
        gap={10}
      >
        <GridItem colSpan={{ base: 1, md: 2 }}>
          <FormControl className="cont_input_edit_large" variant="floating" id="titulo" isRequired>
            <Input
              className={`input_edit_large ${!bandEdit ? "input_disabled" : ""}`}
              name="titulo"
              variant="outlined"
              type="text"
              disabled={!bandEdit}
              value={evento?.titulo || ""}
              onChange={handleChangeInput}
            />
            <FormLabel>Título</FormLabel>
          </FormControl>
        </GridItem>

        <GridItem colSpan={{ base: 1, md: 2 }}>
          <FormControl className="cont_input_edit_large" variant="floating" id="fecha" isRequired>
            <Input
              className={`input_edit_large ${!bandEdit ? "input_disabled" : ""}`}
              name="fecha"
              variant="outlined"
              type="date"
              disabled={!bandEdit}
              value={evento?.fecha || ""}
              onChange={handleChangeInput}
            />
            <FormLabel>Fecha</FormLabel>
          </FormControl>
        </GridItem>

        <GridItem colSpan={{ base: 1, md: 2 }}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <label style={{ fontWeight: 500, color: "var(--gray-700)" }}>Tipo</label>
            <Select
              style={{ width: "100%" }}
              options={TIPOS_EVENTO}
              placeholder="Seleccione un tipo"
              value={evento?.tipo || undefined}
              onChange={handleChangeSelectTipo}
              disabled={!bandEdit}
            />
          </Space>
        </GridItem>

        <GridItem colSpan={{ base: 1, md: 2 }}>
          <FormControl className="cont_input_edit_large" variant="floating" id="descripcion">
            <Textarea
              className={`input_edit_large ${!bandEdit ? "input_disabled" : ""}`}
              name="descripcion"
              disabled={!bandEdit}
              value={evento?.descripcion || ""}
              onChange={handleChangeInput}
              rows={4}
            />
            <FormLabel>Descripción</FormLabel>
          </FormControl>
        </GridItem>

        <GridItem colSpan={{ base: 1, md: 2 }}>
          <Button
            colorScheme="blue"
            onClick={handleConfirmar}
            isDisabled={!bandEdit}
            width="100%"
            mt={4}
          >
            Actualizar Evento
          </Button>
        </GridItem>
      </Grid>

      <VentEmergConfirmacion
        mje="¿Está seguro de actualizar este evento?"
        isOpen={showVentEmergenteConfirmacion}
        onClose={() => setShowVentEmergenteConfirmacion(false)}
        handleSi={async () => {
          await handleUpdate(evento);
          setShowVentEmergenteConfirmacion(false);
          onCloseEdit();
        }}
      />
    </div>
  );
};

export default EditEvento;
