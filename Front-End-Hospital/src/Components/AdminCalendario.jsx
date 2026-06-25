import React, { useContext, useState } from "react";
import { Table, Button, Input } from "antd";
import { PlusOutlined, SearchOutlined, CalendarOutlined } from "@ant-design/icons";
import CalendarioContext from "../Contexts/CalendarioContext";
import { VentEmergenteAddEvento } from "./VentEmergenteAddEvento";
import { VentEmergenteEditEvento } from "./VentEmergenteEditEvento";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";

export const AdminCalendario = () => {
  const {
    db,
    dbSearch,
    columns,
    eventoSelected,
    showVentEmergenteEditEvento,
    handleCloseVentEmergenteEditEvento,
    showVentEmergenteAddEvento,
    setShowVentEmergenteAddEvento,
    handleCloseVentEmergenteAddEvento,
    handleSearch,
    idEvento,
    showVentEmergenteDelete,
    setShowVentEmergenteDelete,
    loading = false,
    loadingAction = false,
    inhabilitarEvento,
  } = useContext(CalendarioContext);

  const [eventoSearch, setEventoSearch] = useState("");

  return (
    <div className="admin-page-wrapper">
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title">
            <h3>Listado de Eventos</h3>
            <span className="admin-badge">{db.length} en total</span>
          </div>
          <div className="admin-card-actions">
            <Input
              prefix={<SearchOutlined style={{ color: "var(--gray-400)" }} />}
              placeholder="Buscar evento..."
              value={eventoSearch}
              onChange={(e) => {
                setEventoSearch(e.target.value);
                handleSearch(e.target.value);
              }}
              allowClear
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setShowVentEmergenteAddEvento(true)}
              loading={loadingAction}
              disabled={loadingAction}
            >
              Agregar Evento
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

      <VentEmergenteAddEvento
        isOpen={showVentEmergenteAddEvento}
        onClose={handleCloseVentEmergenteAddEvento}
      />

      <VentEmergenteEditEvento
        isOpen={showVentEmergenteEditEvento}
        eventoSelected={eventoSelected}
        onClose={handleCloseVentEmergenteEditEvento}
      />

      <VentEmergConfirmacion
        mje={"¿Está seguro de eliminar este evento?"}
        isOpen={showVentEmergenteDelete}
        onClose={() => setShowVentEmergenteDelete(false)}
        handleSi={() => inhabilitarEvento(idEvento)}
      />
    </div>
  );
};

export default AdminCalendario;
