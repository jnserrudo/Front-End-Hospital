import React, { useContext, useState } from "react";
import { Table, Button, Input } from "antd";
import { PlusOutlined, SearchOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import FAQContext from "../Contexts/FAQContext";
import { VentEmergenteAddFAQ } from "./VentEmergenteAddFAQ";
import { VentEmergenteEditFAQ } from "./VentEmergenteEditFAQ";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";

export const AdminFAQ = () => {
  const {
    db,
    dbSearch,
    columns,
    faqSelected,
    showVentEmergenteEditFAQ,
    handleCloseVentEmergenteEditFAQ,
    showVentEmergenteAddFAQ,
    setShowVentEmergenteAddFAQ,
    handleCloseVentEmergenteAddFAQ,
    handleSearch,
    idFAQ,
    showVentEmergenteDelete,
    setShowVentEmergenteDelete,
    loading = false,
    loadingAction = false,
    inhabilitarFAQ,
  } = useContext(FAQContext);

  const [faqSearch, setFaqSearch] = useState("");

  return (
    <div className="admin-page-wrapper">
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title">
            <h3>Listado de Preguntas Frecuentes</h3>
            <span className="admin-badge">{db.length} en total</span>
          </div>
          <div className="admin-card-actions">
            <Input
              prefix={<SearchOutlined style={{ color: "var(--gray-400)" }} />}
              placeholder="Buscar pregunta..."
              value={faqSearch}
              onChange={(e) => {
                setFaqSearch(e.target.value);
                handleSearch(e.target.value);
              }}
              allowClear
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setShowVentEmergenteAddFAQ(true)}
              loading={loadingAction}
              disabled={loadingAction}
            >
              Agregar Pregunta
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

      <VentEmergenteAddFAQ
        isOpen={showVentEmergenteAddFAQ}
        onClose={handleCloseVentEmergenteAddFAQ}
      />

      <VentEmergenteEditFAQ
        isOpen={showVentEmergenteEditFAQ}
        faqSelected={faqSelected}
        onClose={handleCloseVentEmergenteEditFAQ}
      />

      <VentEmergConfirmacion
        mje={"¿Está seguro de eliminar esta pregunta?"}
        isOpen={showVentEmergenteDelete}
        onClose={() => setShowVentEmergenteDelete(false)}
        handleSi={() => inhabilitarFAQ(idFAQ)}
      />
    </div>
  );
};

export default AdminFAQ;
