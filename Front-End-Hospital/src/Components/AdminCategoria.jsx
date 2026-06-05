import React, { useContext, useState } from "react";
import { Table, Button, Input } from "antd";
import { PlusOutlined, SearchOutlined, AppstoreOutlined } from "@ant-design/icons";

import CategoriaContext from "../Contexts/CategoriaContext";
import { VentEmergenteAddCategoria } from "./VentEmergenteAddCategoria";
import { VentEmergenteEditCategoria } from "./VentEmergenteEditCategoria";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import { inhabilitarCategoria } from "../services/categoria-services";
export const AdminCategoria = () => {
  const {
    db,
    dbSearch,
    columns,
    categoriaSelected,
    showVentEmergenteEditCategoria,
    handleCloseVentEmergenteEditCategoria,
    showVentEmergenteAddCategoria,
    setShowVentEmergenteAddCategoria,
    handleCloseVentEmergenteAddCategoria,
    handleSearch,
    idCategoria,
    showVentEmergenteDelete,
    setShowVentEmergenteDelete,
    loading = false,
    loadingAction = false,
  } = useContext(CategoriaContext);

  const inhabilitarRegistro = async (id) => {
    const result = await inhabilitarCategoria(id);
  };

  const [categoriaSearch, setCategoriaSearch] = useState("");

  return (
    <div className="admin-page-wrapper">
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title">
            <h3>Listado de Categorías</h3>
            <span className="admin-badge">{db.length} en total</span>
          </div>
          <div className="admin-card-actions">
            <Input
              prefix={<SearchOutlined style={{ color: "var(--gray-400)" }} />}
              placeholder="Buscar categoría..."
              value={categoriaSearch}
              onChange={(e) => {
                setCategoriaSearch(e.target.value);
                handleSearch(e.target.value);
              }}
              allowClear
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setShowVentEmergenteAddCategoria(true)}
              loading={loadingAction}
              disabled={loadingAction}
            >
              Agregar Categoría
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

      <VentEmergenteAddCategoria
        isOpen={showVentEmergenteAddCategoria}
        onClose={handleCloseVentEmergenteAddCategoria}
      />

      <VentEmergenteEditCategoria
        isOpen={showVentEmergenteEditCategoria}
        categoriaSelected={categoriaSelected}
        onClose={handleCloseVentEmergenteEditCategoria}
      />

      <VentEmergConfirmacion
        mje={"¿Está seguro de eliminar este registro?"}
        isOpen={showVentEmergenteDelete}
        onClose={() => setShowVentEmergenteDelete(false)}
        handleSi={() => inhabilitarRegistro(idCategoria)}
      />
    </div>
  );
};
