import React, { useContext, useState } from "react";
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

export const AddFAQ = ({ onClosePadre }) => {
  const {
    faqToInsert,
    handleChangeInputInsert,
    handleChangeSelectCategoriaInsert,
    bandInsert,
    handleInsert,
  } = useContext(FAQContext);

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
          <FormControl className="cont_input_edit_large" variant="floating" id="pregunta" isRequired>
            <Input
              className="input_floating"
              placeholder=""
              name="pregunta"
              variant="outlined"
              type="text"
              value={faqToInsert?.pregunta || ""}
              onChange={handleChangeInputInsert}
            />
            <FormLabel className="label_floating">Pregunta</FormLabel>
          </FormControl>
        </GridItem>

        <GridItem colSpan={{ base: 1, md: 2 }}>
          <FormControl className="cont_input_edit_large" variant="floating" id="respuesta" isRequired>
            <Textarea
              className="input_floating"
              placeholder=""
              name="respuesta"
              value={faqToInsert?.respuesta || ""}
              onChange={handleChangeInputInsert}
              rows={4}
            />
            <FormLabel className="label_floating">Respuesta</FormLabel>
          </FormControl>
        </GridItem>

        <GridItem colSpan={{ base: 1, md: 2 }}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <label style={{ fontWeight: 500, color: "var(--gray-700)" }}>Categoría</label>
            <Select
              style={{ width: "100%" }}
              options={CATEGORIAS}
              placeholder="Seleccione una categoría"
              value={faqToInsert?.categoria || undefined}
              onChange={handleChangeSelectCategoriaInsert}
            />
          </Space>
        </GridItem>

        <GridItem colSpan={{ base: 1, md: 2 }}>
          <Button
            colorScheme="blue"
            onClick={handleConfirmar}
            isDisabled={!bandInsert}
            width="100%"
            mt={4}
          >
            Guardar Pregunta
          </Button>
        </GridItem>
      </Grid>

      <VentEmergConfirmacion
        mje="¿Está seguro de agregar esta pregunta?"
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

export default AddFAQ;
