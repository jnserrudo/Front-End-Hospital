import React, { useContext, useEffect, useState } from "react";
import { Table, Button, Input } from "antd";
import { PlusOutlined, SearchOutlined, FileTextOutlined } from "@ant-design/icons";
import RecetaContext from "../Contexts/RecetaContext";
import { VentEmergenteAddReceta } from "./VentEmergenteAddReceta";
import { VentEmergenteEditReceta } from "./VentEmergenteEditReceta";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import { inhabilitarRecetas } from "../services/recetas-services";

export const AdminReceta = () => {
  const {
    db,
    dbSearch,
    columns,
    recetaSelected,
    showVentEmergenteEditReceta,
    handleCloseVentEmergenteEditReceta,
    showVentEmergenteAddReceta,
    setShowVentEmergenteAddReceta,
    handleCloseVentEmergenteAddReceta,
    handleSearch,
    setNdocuPaciente,
    idReceta,
    showVentEmergenteDelete,
    setShowVentEmergenteDelete,
    loading,
    loadingAction,
  } = useContext(RecetaContext);

  const [recetaSearch, setRecetaSearch] = useState("");

  const inhabilitarRegistro = async (id) => {
    await inhabilitarRecetas(id);
  };

  useEffect(() => {
    if (localStorage.getItem("rol") == 3) {
      setNdocuPaciente(localStorage.getItem("dni"));
    }
  }, []);

  return (
    <div className="admin-page-wrapper">
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title">
            <h3>Listado de Recetas</h3>
            <span className="admin-badge">{db.length} en total</span>
          </div>
          <div className="admin-card-actions">
            <Input
              prefix={<SearchOutlined style={{ color: "var(--gray-400)" }} />}
              placeholder="Buscar receta..."
              value={recetaSearch}
              onChange={(e) => {
                setRecetaSearch(e.target.value);
                handleSearch(e.target.value, db);
              }}
              allowClear
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setShowVentEmergenteAddReceta(true)}
              loading={loadingAction}
              disabled={loadingAction}
            >
              Agregar Receta
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

      <VentEmergenteAddReceta
        isOpen={showVentEmergenteAddReceta}
        onClose={handleCloseVentEmergenteAddReceta}
      />
      <VentEmergenteEditReceta
        isOpen={showVentEmergenteEditReceta}
        recetaSelected={recetaSelected}
        onClose={handleCloseVentEmergenteEditReceta}
      />
      <VentEmergConfirmacion
        mje={"¿Está seguro de eliminar este registro?"}
        isOpen={showVentEmergenteDelete}
        onClose={() => setShowVentEmergenteDelete(false)}
        handleSi={() => inhabilitarRegistro(idReceta)}
      />
    </div>
  );
};
