import {
  Button,
  Textarea,
  FormControl,
  FormLabel,
  Input,
  Grid,
  GridItem,
  Select as ChakraSelect,
} from "@chakra-ui/react";
import React, { useContext, useState, useEffect } from "react";
import CategoriasContext from "../Contexts/CategoriaContext";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import { useNavigate } from "react-router-dom";

export const EditCategoria = ({ categoria, onCloseEdit }) => {
  const navigate = useNavigate();
  const { handleChangeInput, handleChangeSelectTipos, handleUpdate } =
    useContext(CategoriasContext);
  const [bandEdit, setBandEdit] = useState(false);
  const [bandUpdated, setBandUpdated] = useState(false);
  const [showVentEmergenteConfirmacion, setShowVentEmergenteConfirmacion] =
    useState(false);

  const optionsTipos = [
    { value: 1, label: "Ejercicio" },
    { value: 2, label: "Información" },
    { value: 3, label: "Recetas" },
  ];

  useEffect(() => {
    setBandUpdated(bandEdit);
  }, [bandEdit]);

  if (!categoria) {
    return null;
  }

  return (
    <div className="form">
      {/* Grid responsive usando auto-fit */}
      <Grid
        className="grid_chackra"
        templateColumns={{
          base: "1fr",
          md: "repeat(auto-fit, minmax(300px, 1fr))",
        }}
        gap={10}
      >
        {/* Nombre */}
        <GridItem colSpan={{ base: 1, md: 2 }}>
          <FormControl isRequired>
            <Input
              className="input_floating"
              placeholder=" "
              name="nombre"
              disabled={!bandEdit}
              value={categoria.nombre || ""}
              onChange={(e) => handleChangeInput(e)}
            />
            <FormLabel className="label_floating">Nombre</FormLabel>
          </FormControl>
        </GridItem>

        {/* Descripción */}
        <GridItem colSpan={{ base: 1, md: 2 }}>
          <FormControl isRequired>
            <Textarea
              className="input_floating"
              placeholder=" "
              name="descripcion"
              disabled={!bandEdit}
              value={categoria.descripcion || ""}
              onChange={(e) => handleChangeInput(e)}
              size="sm"
            />
            <FormLabel className="label_floating">Descripción</FormLabel>
          </FormControl>
        </GridItem>

        {/* Tipo */}
        <GridItem colSpan={{ base: 1, md: 2 }}>
          <FormControl isRequired>
            <FormLabel>Tipo</FormLabel>
            <ChakraSelect
              value={categoria.tipo}
              onChange={handleChangeSelectTipos}
              disabled={!bandEdit}
            >
              {optionsTipos.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </ChakraSelect>
          </FormControl>
        </GridItem>
      </Grid>

      {/* Botones de acción */}
      <div className="action_buttons">
        {!bandEdit ? (
          <Button colorScheme="blue" onClick={() => setBandEdit(true)}>
            Editar
          </Button>
        ) : (
          <Button colorScheme="gray" onClick={() => setBandEdit(false)}>
            Cancelar
          </Button>
        )}

        {bandUpdated && (
          <Button
            colorScheme="green"
            onClick={() => setShowVentEmergenteConfirmacion(true)}
          >
            Actualizar
          </Button>
        )}
      </div>

      <VentEmergConfirmacion
        onClosePadre={onCloseEdit}
        onClose={() => setShowVentEmergenteConfirmacion(false)}
        mje={`¿Está seguro de actualizar los datos de la categoría?`}
        handleSi={() => handleUpdate(categoria)}
        isOpen={showVentEmergenteConfirmacion}
      />
    </div>
  );
};
