import React, { useContext, useState } from "react";
import { Table, Button, Input } from "antd";
import { PlusOutlined, SearchOutlined, InfoCircleOutlined } from "@ant-design/icons";

import InformacionContext from "../Contexts/InformacionContext";
import { VentEmergenteAddInformacion } from "./VentEmergenteAddInformacion";
import { VentEmergenteEditInformacion } from "./VentEmergenteEditInformacion";
import { inhabilitarInformacion } from "../services/informacion-services";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
export const AdminInformacion = () => {
  const {
    db = [],
    dbSearch,
    columns,
    informacionSelected,
    showVentEmergenteEditInformacion,
    handleCloseVentEmergenteEditInformacion,
    showVentEmergenteAddInformacion,
    setShowVentEmergenteAddInformacion,
    handleCloseVentEmergenteAddInformacion,
    handleSearch,
    idInformacion,
    showVentEmergenteDelete,
    setShowVentEmergenteDelete,
    loading = false,
    loadingAction = false,
  } = useContext(InformacionContext);

  const inhabilitarRegistro = async (id) => {
    const result = await inhabilitarInformacion(id);
  };

  const [informacionSearch, setInformacionSearch] = useState("");

  return (
    <div className="admin-page-wrapper">
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title">
            <h3>Listado de Información</h3>
            <span className="admin-badge">{db.length} en total</span>
          </div>
          <div className="admin-card-actions">
            <Input
              prefix={<SearchOutlined style={{ color: "var(--gray-400)" }} />}
              placeholder="Buscar información..."
              value={informacionSearch}
              onChange={(e) => {
                setInformacionSearch(e.target.value);
                handleSearch(e.target.value, db);
              }}
              allowClear
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setShowVentEmergenteAddInformacion(true)}
              loading={loadingAction}
              disabled={loadingAction}
            >
              Agregar Información
            </Button>
          </div>
        </div>

        <Table
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

      <VentEmergenteAddInformacion
        isOpen={showVentEmergenteAddInformacion}
        onClose={handleCloseVentEmergenteAddInformacion}
      />

      <VentEmergenteEditInformacion
        isOpen={showVentEmergenteEditInformacion}
        informacionSelected={informacionSelected}
        onClose={handleCloseVentEmergenteEditInformacion}
      />

      <VentEmergConfirmacion
        mje={"¿Está seguro de eliminar este registro?"}
        isOpen={showVentEmergenteDelete}
        onClose={() => setShowVentEmergenteDelete(false)}
        handleSi={() => inhabilitarRegistro(idInformacion)}
      />
    </div>
  );
};
