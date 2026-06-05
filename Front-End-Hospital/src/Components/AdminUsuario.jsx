import React, { useContext, useState } from "react";
import { Table, Button, Input } from "antd";
import { PlusOutlined, SearchOutlined, TeamOutlined } from "@ant-design/icons";

import UsuarioContext from "../Contexts/UsuarioContext";
import { VentEmergenteAddUsuario } from "./VentEmergenteAddUsuario";
import { VentEmergenteEditUsuario } from "./VentEmergenteEditUsuario";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import { inhabilitarUsuario } from "../services/usuario-services";
export const AdminUsuario = () => {
  const {
    db,
    dbSearch,
    columns,
    usuarioSelected,
    showVentEmergenteEditUsuario,
    handleCloseVentEmergenteEditUsuario,
    showVentEmergenteAddUsuario,
    setShowVentEmergenteAddUsuario,
    handleCloseVentEmergenteAddUsuario,
    handleSearch,
    idUsuario,
    showVentEmergenteDelete,
    setShowVentEmergenteDelete,
    loading = false,
    loadingAction = false,
  } = useContext(UsuarioContext);

  const inhabilitarRegistro = async (id) => {
    const result = await inhabilitarUsuario(id);
  };
  const [usuarioSearch, setUsuarioSearch] = useState("");

  return (
    <div className="admin-page-wrapper">
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title">
            <h3>Listado de Usuarios</h3>
            <span className="admin-badge">{db.length} en total</span>
          </div>
          <div className="admin-card-actions">
            <Input
              prefix={<SearchOutlined style={{ color: "var(--gray-400)" }} />}
              placeholder="Buscar usuario..."
              value={usuarioSearch}
              onChange={(e) => {
                setUsuarioSearch(e.target.value);
                handleSearch(e.target.value);
              }}
              allowClear
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setShowVentEmergenteAddUsuario(true)}
              loading={loadingAction}
              disabled={loadingAction}
            >
              Agregar Usuario
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

      <VentEmergenteAddUsuario
        isOpen={showVentEmergenteAddUsuario}
        onClose={handleCloseVentEmergenteAddUsuario}
      />

      <VentEmergenteEditUsuario
        isOpen={showVentEmergenteEditUsuario}
        usuarioSelected={usuarioSelected}
        onClose={handleCloseVentEmergenteEditUsuario}
      />

      <VentEmergConfirmacion
        mje={"¿Está seguro de eliminar este registro?"}
        isOpen={showVentEmergenteDelete}
        onClose={() => setShowVentEmergenteDelete(false)}
        handleSi={() => inhabilitarRegistro(idUsuario)}
      />
    </div>
  );
};
