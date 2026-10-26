import React, { useContext, useState, useEffect } from "react";
import { ModoLecturaNota } from "./ModoLecturaNota";
import { Button, FormControl, FormLabel, Grid, GridItem, Textarea } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { Select, Space } from "antd";
import FAQContext from "../Contexts/FAQContext";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";

const CATEGORIAS = [
  { value: "general", label: "General" },
  { value: "nutricion", label: "Nutrición" },
  { value: "ejercicio", label: "Ejercicio" },
  { value: "patologias", label: "Patologías" },
];

export const EditFAQ = ({ faq, onCloseEdit }) => {
  const { handleChangeInput, handleChangeSelectCategoria, handleUpdate } = useContext(FAQContext);
  const [bandEdit, setBandEdit] = useState(false);
  const [showVentEmergenteConfirmacion, setShowVentEmergenteConfirmacion] = useState(false);

  const handleConfirmar = () => {
    if (bandEdit) {
      setShowVentEmergenteConfirmacion(true);
    }
  };

  useEffect(() => {
    setBandEdit(true);
  }, [faq]);

  if (!faq) {
    return null;
  }

  return (
    <div className="form_edit_receta">
      <ModoLecturaNota editando={bandEdit} />
      <Grid
        className="grid_chackra"
        templateColumns={{ base: "1fr", md: "repeat(auto-fit, minmax(300px, 1fr))" }}
        gap={10}
      >
        <GridItem colSpan={{ base: 1, md: 2 }}>
          <FormControl className="cont_input_edit_large" variant="floating" id="pregunta" isRequired>
            <Input
              className={`input_edit_large ${!bandEdit ? "input_disabled" : ""}`}
              name="pregunta"
              variant="outlined"
              type="text"
              disabled={!bandEdit}
              value={faq?.pregunta || ""}
              onChange={handleChangeInput}
            />
            <FormLabel>Pregunta</FormLabel>
          </FormControl>
        </GridItem>

        <GridItem colSpan={{ base: 1, md: 2 }}>
          <FormControl className="cont_input_edit_large" variant="floating" id="respuesta" isRequired>
            <Textarea
              className={`input_edit_large ${!bandEdit ? "input_disabled" : ""}`}
              name="respuesta"
              disabled={!bandEdit}
              value={faq?.respuesta || ""}
              onChange={handleChangeInput}
              rows={4}
            />
            <FormLabel>Respuesta</FormLabel>
          </FormControl>
        </GridItem>

        <GridItem colSpan={{ base: 1, md: 2 }}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <label style={{ fontWeight: 500, color: "var(--gray-700)" }}>Categoría</label>
            <Select
              style={{ width: "100%" }}
              options={CATEGORIAS}
              placeholder="Elegí una categoría"
              value={faq?.categoria ? String(faq.categoria).toLowerCase() : undefined}
              onChange={handleChangeSelectCategoria}
              disabled={!bandEdit}
            />
          </Space>
        </GridItem>

        <GridItem colSpan={{ base: 1, md: 2 }}>
          <Button
            colorScheme="blue"
            onClick={handleConfirmar}
            isDisabled={!bandEdit}
            width="100%"
            mt={4}
          >
            Guardar cambios
          </Button>
        </GridItem>
      </Grid>

      <VentEmergConfirmacion
        title={`¿Guardar los cambios de la pregunta «${faq?.pregunta || ""}»?`}
        mje="Se va a mostrar actualizada en Preguntas frecuentes."
        confirmText="Guardar cambios"
        errorFallback="No pudimos guardar los cambios"
        isOpen={showVentEmergenteConfirmacion}
        onClose={() => setShowVentEmergenteConfirmacion(false)}
        handleSi={async () => {
          await handleUpdate(faq);
          setShowVentEmergenteConfirmacion(false);
          onCloseEdit();
        }}
      />
    </div>
  );
};

export default EditFAQ;
