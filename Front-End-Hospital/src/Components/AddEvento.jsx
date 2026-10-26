import React, { useContext, useState } from "react";
import { Button, FormControl, FormLabel, Grid, GridItem, Textarea } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { Select, Space } from "antd";
import CalendarioContext from "../Contexts/CalendarioContext";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";

const TIPOS_EVENTO = [
  { value: "general", label: "General" },
  { value: "patologia", label: "Por Patología" },
];

export const AddEvento = ({ onClosePadre }) => {
  const {
    eventoToInsert,
    handleChangeInputInsert,
    handleChangeSelectTipoInsert,
    bandInsert,
    handleInsert,
  } = useContext(CalendarioContext);

  const [showVentEmergenteConfirmacion, setShowVentEmergenteConfirmacion] = useState(false);

  const handleConfirmar = () => {
    if (bandInsert) {
      setShowVentEmergenteConfirmacion(true);
    }
  };

  return (
    <div className="form">
      <Grid
        className="grid_chackra"
        templateColumns={{ base: "1fr", md: "repeat(auto-fit, minmax(300px, 1fr))" }}
        gap={10}
      >
        <GridItem colSpan={{ base: 1, md: 2 }}>
          <FormControl className="cont_input_edit_large" variant="floating" id="titulo" isRequired>
            <Input
              className="input_floating"
              placeholder=""
              name="titulo"
              variant="outlined"
              type="text"
              value={eventoToInsert?.titulo || ""}
              onChange={handleChangeInputInsert}
            />
            <FormLabel className="label_floating">Título</FormLabel>
          </FormControl>
        </GridItem>

        <GridItem colSpan={{ base: 1, md: 2 }}>
          <FormControl className="cont_input_edit_large" variant="floating" id="fecha" isRequired>
            <Input
              className="input_floating"
              placeholder=""
              name="fecha"
              variant="outlined"
              type="date"
              value={eventoToInsert?.fecha || ""}
              onChange={handleChangeInputInsert}
            />
            <FormLabel className="label_floating">Fecha</FormLabel>
          </FormControl>
        </GridItem>

        <GridItem colSpan={{ base: 1, md: 2 }}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <label style={{ fontWeight: 500, color: "var(--gray-700)" }}>Tipo</label>
            <Select
              style={{ width: "100%" }}
              options={TIPOS_EVENTO}
              placeholder="Elegí un tipo"
              value={eventoToInsert?.tipo || undefined}
              onChange={handleChangeSelectTipoInsert}
            />
          </Space>
        </GridItem>

        <GridItem colSpan={{ base: 1, md: 2 }}>
          <FormControl className="cont_input_edit_large" variant="floating" id="descripcion">
            <Textarea
              className="input_floating"
              placeholder=""
              name="descripcion"
              value={eventoToInsert?.descripcion || ""}
              onChange={handleChangeInputInsert}
              rows={4}
            />
            <FormLabel className="label_floating">Descripción (opcional)</FormLabel>
          </FormControl>
        </GridItem>

        <GridItem colSpan={{ base: 1, md: 2 }}>
          <Button
            colorScheme="blue"
            onClick={handleConfirmar}
            isDisabled={!bandInsert}
            width="100%"
            mt={4}
          >
            Guardar evento
          </Button>
          {!bandInsert && (
            <p style={{ fontSize: 13, color: "var(--gray-500)", marginTop: 6, textAlign: "center" }}>
              Completá los campos obligatorios para habilitar el botón.
            </p>
          )}
        </GridItem>
      </Grid>

      <VentEmergConfirmacion
        title={`¿Agregar el evento «${eventoToInsert?.titulo || ""}» al calendario?`}
        mje="Se va a mostrar en el calendario de la app."
        confirmText="Agregar evento"
        errorFallback="No pudimos guardar los cambios"
        isOpen={showVentEmergenteConfirmacion}
        onClose={() => setShowVentEmergenteConfirmacion(false)}
        handleSi={async () => {
          await handleInsert();
          setShowVentEmergenteConfirmacion(false);
          onClosePadre();
        }}
      />
    </div>
  );
};

export default AddEvento;
