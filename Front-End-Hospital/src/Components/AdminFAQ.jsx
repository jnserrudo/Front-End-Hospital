import React, { useContext, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import FAQContext from "../Contexts/FAQContext";
import { VentEmergenteAddFAQ } from "./VentEmergenteAddFAQ";
import { VentEmergenteEditFAQ } from "./VentEmergenteEditFAQ";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import { AdminEntityList } from "./AdminEntityList";

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
    <>
      <AdminEntityList
        title="Listado de Preguntas Frecuentes"
        count={db.length}
        searchProps={{
          placeholder: "Buscar pregunta...",
          value: faqSearch,
          onChange: (e) => {
            setFaqSearch(e.target.value);
            handleSearch(e.target.value);
          },
        }}
        addButton={{
          label: "Agregar Pregunta",
          icon: <PlusOutlined />,
          onClick: () => setShowVentEmergenteAddFAQ(true),
          loading: loadingAction,
          disabled: loadingAction,
        }}
        columns={columns}
        dataSource={dbSearch.length > 0 ? dbSearch : db}
        loading={loading}
        rowKey="id"
      />

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
    </>
  );
};

export default AdminFAQ;
