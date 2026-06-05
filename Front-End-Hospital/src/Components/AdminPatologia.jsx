import React, { useContext, useState } from "react";
import { Table, Button, Input } from "antd";
import { PlusOutlined, SearchOutlined, MedicineBoxOutlined } from "@ant-design/icons";

import PatologiaContext from "../Contexts/PatologiaContext";
import { VentEmergenteAddPatologia } from "./VentEmergenteAddPatologia";
import { VentEmergenteEditPatologia } from "./VentEmergenteEditPatologia";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import { inhabilitarPatologia } from "../services/patologia-services";
export const AdminPatologia = () => {
  const {
    db,
    columns,
    patologiaSelected,
    showVentEmergenteEditPatologia,
    handleCloseVentEmergenteEditPatologia,
    showVentEmergenteAddPatologia,
    setShowVentEmergenteAddPatologia,
    handleCloseVentEmergenteAddPatologia,
    handleSearch,
    idPatologia,
    showVentEmergenteDelete,
    setShowVentEmergenteDelete,
    dbSearch,
    loading = false,
    loadingAction = false,
  } = useContext(PatologiaContext);

  const inhabilitarRegistro = async (id) => {
    const result = await inhabilitarPatologia(id);
  };

  const [patologiaSearch, setPatologiaSearch] = useState("");

  return (
    <div className="admin-page-wrapper">
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title">
            <h3>Listado de Patologías</h3>
            <span className="admin-badge">{db.length} en total</span>
          </div>
          <div className="admin-card-actions">
            <Input
              prefix={<SearchOutlined style={{ color: "var(--gray-400)" }} />}
              placeholder="Buscar patología..."
              value={patologiaSearch}
              onChange={(e) => {
                setPatologiaSearch(e.target.value);
                handleSearch(e.target.value);
              }}
              allowClear
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setShowVentEmergenteAddPatologia(true)}
              loading={loadingAction}
              disabled={loadingAction}
            >
              Agregar Patología
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

      <VentEmergenteAddPatologia
        isOpen={showVentEmergenteAddPatologia}
        onClose={handleCloseVentEmergenteAddPatologia}
      />

      <VentEmergenteEditPatologia
        isOpen={showVentEmergenteEditPatologia}
        patologiaSelected={patologiaSelected}
        onClose={handleCloseVentEmergenteEditPatologia}
      />

      <VentEmergConfirmacion
        mje={"¿Está seguro de eliminar este registro?"}
        isOpen={showVentEmergenteDelete}
        onClose={() => setShowVentEmergenteDelete(false)}
        handleSi={() => inhabilitarRegistro(idPatologia)}
      />
    </div>
  );
};
