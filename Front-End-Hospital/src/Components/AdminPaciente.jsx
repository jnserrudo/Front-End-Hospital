import React, { useContext, useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";

import PacienteContext from "../Contexts/PacienteContext";
import { VentEmergenteAddPaciente } from "./VentEmergenteAddPaciente";
import { VentEmergenteEditPaciente } from "./VentEmergenteEditPaciente";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import { inhabilitarPaciente } from "../services/paciente-services";
import { AdminEntityList } from "./AdminEntityList";

export const AdminPaciente = ({ selectedKey }) => {
  const {
    db,
    columns,
    pacienteSelected,
    showVentEmergenteEditPaciente,
    handleCloseVentEmergenteEditPaciente,
    showVentEmergenteAddPaciente,
    setShowVentEmergenteAddPaciente,
    handleCloseVentEmergenteAddPaciente,
    handleSearch,
    idPaciente,
    getallPacientes,
    showVentEmergenteDelete,
    setShowVentEmergenteDelete,
    loading = false,
    loadingAction = false,
  } = useContext(PacienteContext);

  const [pacienteSearch, setPacienteSearch] = useState("");

  const inhabilitarRegistro = async (id) => {
    await inhabilitarPaciente(id);
  };

  useEffect(() => {
    getallPacientes();
  }, [selectedKey]);

  const pacientesFiltrados = db
    .filter((pac) => pac?.usuario)
    .map((pac) => ({
      id: pac?.id,
      ...pac?.usuario,
    }));

  return (
    <>
      <AdminEntityList
        title="Listado de Pacientes"
        count={pacientesFiltrados.length}
        searchProps={{
          placeholder: "Buscar paciente...",
          value: pacienteSearch,
          onChange: (e) => {
            setPacienteSearch(e.target.value);
            handleSearch(e.target.value);
          },
        }}
        addButton={{
          label: "Agregar Paciente",
          icon: <PlusOutlined />,
          onClick: () => setShowVentEmergenteAddPaciente(true),
          loading: loadingAction,
          disabled: loadingAction,
        }}
        columns={columns}
        dataSource={pacientesFiltrados}
        loading={loading}
        rowKey="id"
      />

      <VentEmergenteAddPaciente
        isOpen={showVentEmergenteAddPaciente}
        onClose={handleCloseVentEmergenteAddPaciente}
      />

      <VentEmergenteEditPaciente
        isOpen={showVentEmergenteEditPaciente}
        pacienteSelected={pacienteSelected}
        onClose={handleCloseVentEmergenteEditPaciente}
      />

      <VentEmergConfirmacion
        mje={"¿Está seguro de eliminar este registro?"}
        isOpen={showVentEmergenteDelete}
        onClose={() => setShowVentEmergenteDelete(false)}
        handleSi={() => inhabilitarRegistro(idPaciente)}
      />
    </>
  );
};
