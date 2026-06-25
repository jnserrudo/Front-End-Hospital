import React, { useContext, useEffect, useState } from "react";
import { Table, Button, Input } from "antd";
import { PlusOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";

import PacienteContext from "../Contexts/PacienteContext";
import { VentEmergenteAddPaciente } from "./VentEmergenteAddPaciente";
import { VentEmergenteEditPaciente } from "./VentEmergenteEditPaciente";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import { inhabilitarPaciente } from "../services/paciente-services";

export const AdminPaciente = ({selectedKey}) => {
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

  const [showVentEmergenteConfirmacion, setShowVentEmergenteConfirmacion] =
    useState(false);
  const [pacienteSearch, setPacienteSearch] = useState("");

  const handleCloseVentEmergente = async () => {
    setShowVentEmergenteConfirmacion(false);
  };

  const inhabilitarRegistro = async (id) => {
    const result = await inhabilitarPaciente(id);
  };

  useEffect(() => {
    getallPacientes();
  }, [selectedKey]);

  const pacientesFiltrados = db.filter(pac => pac?.usuario).map((pac) => ({
    id: pac?.id,
    ...pac?.usuario,
  }));

  return (
    <div className="admin-page-wrapper">
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title">
            <h3>Listado de Pacientes</h3>
            <span className="admin-badge">{pacientesFiltrados.length} en total</span>
          </div>
          <div className="admin-card-actions">
            <Input
              prefix={<SearchOutlined style={{ color: "var(--gray-400)" }} />}
              placeholder="Buscar paciente..."
              value={pacienteSearch}
              onChange={(e) => {
                setPacienteSearch(e.target.value);
                handleSearch(e.target.value);
              }}
              allowClear
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setShowVentEmergenteAddPaciente(true)}
              loading={loadingAction}
              disabled={loadingAction}
            >
              Agregar Paciente
            </Button>
          </div>
        </div>

        <Table scroll={{ x: 'max-content' }}
          className="admin-table"
          columns={columns}
          pagination={{ position: ["bottomRight"], pageSize: 8 }}
          dataSource={pacientesFiltrados}
          loading={loading}
          rowKey="id"
          size="middle"
          locale={{ emptyText: "Sin registros" }}
        />
      </div>

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
    </div>
  );
};
