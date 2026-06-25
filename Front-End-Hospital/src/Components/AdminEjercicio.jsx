import React, { useContext, useState } from "react";
import { Table, Button, Input } from "antd";
import { PlusOutlined, SearchOutlined, ThunderboltOutlined } from "@ant-design/icons";

import EjercicioContext from "../Contexts/EjercicioContext";
import { VentEmergenteAddEjercicio } from "./VentEmergenteAddEjercicio";
import { VentEmergenteEditEjercicio } from "./VentEmergenteEditEjercicio";
import { inhabilitarEjercicio } from "../services/ejercicio-services";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
export const AdminEjercicio = () => {
  const {
    db = [],
    dbSearch,
    columns,
    ejercicioSelected,
    showVentEmergenteEditEjercicio,
    handleCloseVentEmergenteEditEjercicio,
    showVentEmergenteAddEjercicio,
    setShowVentEmergenteAddEjercicio,
    handleCloseVentEmergenteAddEjercicio,
    handleSearch,
    idEjercicio,
    showVentEmergenteDelete,
    setShowVentEmergenteDelete,
    loading = false,
    loadingAction = false,
  } = useContext(EjercicioContext);

  const inhabilitarRegistro = async (id) => {
    const result = await inhabilitarEjercicio(id);
  };
  const [ejercicioSearch, setEjercicioSearch] = useState("");

  return (
    <div className="admin-page-wrapper">
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title">
            <h3>Listado de Ejercicios</h3>
            <span className="admin-badge">{db.length} en total</span>
          </div>
          <div className="admin-card-actions">
            <Input
              prefix={<SearchOutlined style={{ color: "var(--gray-400)" }} />}
              placeholder="Buscar ejercicio..."
              value={ejercicioSearch}
              onChange={(e) => {
                setEjercicioSearch(e.target.value);
                handleSearch(e.target.value, db);
              }}
              allowClear
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setShowVentEmergenteAddEjercicio(true)}
              loading={loadingAction}
              disabled={loadingAction}
            >
              Agregar Ejercicio
            </Button>
          </div>
        </div>

        <Table scroll={{ x: 'max-content' }}
          className="admin-table"
          columns={columns}
          pagination={{ position: ["bottomRight"], pageSize: 8 }}
          dataSource={dbSearch.length > 0 ? dbSearch : db}
          loading={loading}
          rowKey="id"
          size="middle"
          locale={{ emptyText: "Sin registros" }}
        />
      </div>

      <VentEmergenteAddEjercicio
        isOpen={showVentEmergenteAddEjercicio}
        onClose={handleCloseVentEmergenteAddEjercicio}
      />

      <VentEmergenteEditEjercicio
        isOpen={showVentEmergenteEditEjercicio}
        ejercicioSelected={ejercicioSelected}
        onClose={handleCloseVentEmergenteEditEjercicio}
      />

      <VentEmergConfirmacion
        mje={"¿Está seguro de eliminar este registro?"}
        isOpen={showVentEmergenteDelete}
        onClose={() => setShowVentEmergenteDelete(false)}
        handleSi={() => inhabilitarRegistro(idEjercicio)}
      />
    </div>
  );
};
