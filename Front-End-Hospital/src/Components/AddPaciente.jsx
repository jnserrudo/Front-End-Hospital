import React, { useContext, useEffect, useState } from "react";
import { Button, FormControl, FormLabel, Grid, GridItem } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { Select, Space } from "antd";
import toast from "react-hot-toast";
import PacientesContext from "../Contexts/PacienteContext";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";

export const AddPaciente = ({ onClosePadre }) => {
  const {
    pacienteToInsert,
    handleChangeInputInsert,
    handleChangeSelectRolInsert,
    handleChangeSelectInsert,
    bandInsert,
    handleInsert,
    allRolesAdd,
    patologiasToPacienteAdd,
    handleCloseVentEmergConfirmacion,
  } = useContext(PacientesContext);

  const [showVentEmergenteConfirmacion, setShowVentEmergenteConfirmacion] = useState(false);

  const sharedPropsRoles = {
    style: { width: "100%" },
    options: allRolesAdd || [],
    placeholder: "Seleccione un Rol",
    maxTagCount: "responsive",
  };

  const sharedPropsPatologias = {
    mode: "multiple",
    style: { width: "100%" },
    options: patologiasToPacienteAdd || [],
    placeholder: "Seleccione Patologías",
    maxTagCount: "responsive",
  };

  const handleCloseVentEmergente = async () => {
    setShowVentEmergenteConfirmacion(false);
  };

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
          <FormControl className="cont_input_edit_large" variant="floating" id="nombre" isRequired>
            <Input
              className="input_floating"
              placeholder=""
              name="nombre"
              variant="outlined"
              type="text"
              value={pacienteToInsert?.nombre || ""}
              onChange={handleChangeInputInsert}
            />
            <FormLabel className="label_floating">Nombre</FormLabel>
          </FormControl>
        </GridItem>

        <GridItem colSpan={{ base: 1, md: 2 }}>
          <FormControl className="cont_input_edit_large" variant="floating" id="apellido" isRequired>
            <Input
              className="input_floating"
              placeholder=""
              name="apellido"
              variant="outlined"
              type="text"
              value={pacienteToInsert?.apellido || ""}
              onChange={handleChangeInputInsert}
            />
            <FormLabel className="label_floating">Apellido</FormLabel>
          </FormControl>
        </GridItem>

        <GridItem colSpan={{ base: 1, md: 2 }}>
          <FormControl className="cont_input_edit_large" variant="floating" id="dni" isRequired>
            <Input
              className="input_floating"
              placeholder=""
              name="dni"
              variant="outlined"
              type="text"
              value={pacienteToInsert?.dni || ""}
              onChange={handleChangeInputInsert}
            />
            <FormLabel className="label_floating">DNI</FormLabel>
          </FormControl>
        </GridItem>

        <GridItem colSpan={{ base: 1, md: 2 }}>
          <FormControl className="cont_input_edit_large" variant="floating" id="paciente" isRequired>
            <Input
              className="input_floating"
              placeholder=""
              name="paciente"
              variant="outlined"
              type="text"
              value={pacienteToInsert?.paciente || ""}
              onChange={handleChangeInputInsert}
            />
            <FormLabel className="label_floating">Nombre de Usuario</FormLabel>
          </FormControl>
        </GridItem>

        <GridItem colSpan={{ base: 1, md: 2 }}>
          <FormControl className="cont_input_edit_large" variant="floating" id="password" isRequired>
            <Input
              className="input_floating"
              placeholder=""
              name="password"
              variant="outlined"
              type="password"
              value={pacienteToInsert?.password || ""}
              onChange={handleChangeInputInsert}
            />
            <FormLabel className="label_floating">Contraseña</FormLabel>
          </FormControl>
        </GridItem>

        <GridItem colSpan={{ base: 1, md: 2 }}>
          <FormControl className="cont_input_edit_large" variant="floating" id="email" isRequired>
            <Input
              className="input_floating"
              placeholder=""
              name="email"
              variant="outlined"
              type="email"
              value={pacienteToInsert?.email || ""}
              onChange={handleChangeInputInsert}
            />
            <FormLabel className="label_floating">Email</FormLabel>
          </FormControl>
        </GridItem>

        <GridItem colSpan={{ base: 1, md: 2 }}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <label style={{ fontWeight: 500, color: "var(--gray-700)" }}>Rol</label>
            <Select
              {...sharedPropsRoles}
              value={pacienteToInsert?.idRol || undefined}
              onChange={handleChangeSelectRolInsert}
            />
          </Space>
        </GridItem>

        {pacienteToInsert?.idRol == 3 && (
          <GridItem colSpan={{ base: 1, md: 2 }}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <label style={{ fontWeight: 500, color: "var(--gray-700)" }}>Patologías</label>
              <Select
                {...sharedPropsPatologias}
                value={pacienteToInsert?.idsPatologias || []}
                onChange={handleChangeSelectInsert}
              />
            </Space>
          </GridItem>
        )}

        <GridItem colSpan={{ base: 1, md: 2 }}>
          <Button
            colorScheme="blue"
            onClick={handleConfirmar}
            isDisabled={!bandInsert}
            width="100%"
            mt={4}
          >
            Guardar Paciente
          </Button>
        </GridItem>
      </Grid>

      <VentEmergConfirmacion
        mje="¿Está seguro de agregar este paciente?"
        isOpen={showVentEmergenteConfirmacion}
        onClose={handleCloseVentEmergente}
        handleSi={async () => {
          await handleInsert();
          handleCloseVentEmergente();
          onClosePadre();
        }}
      />
    </div>
  );
};

export default AddPaciente;
