import React, { useContext, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import CalendarioContext from "../Contexts/CalendarioContext";
import { VentEmergenteAddEvento } from "./VentEmergenteAddEvento";
import { VentEmergenteEditEvento } from "./VentEmergenteEditEvento";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import { AdminEntityList } from "./AdminEntityList";

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
    <>
      <AdminEntityList
        title="Listado de Eventos"
        count={db.length}
        searchProps={{
          placeholder: "Buscar evento...",
          value: eventoSearch,
          onChange: (e) => {
            setEventoSearch(e.target.value);
            handleSearch(e.target.value);
          },
        }}
        addButton={{
          label: "Agregar Evento",
          icon: <PlusOutlined />,
          onClick: () => setShowVentEmergenteAddEvento(true),
          loading: loadingAction,
          disabled: loadingAction,
        }}
        columns={columns}
        dataSource={dbSearch.length > 0 ? dbSearch : db}
        loading={loading}
        rowKey="id"
      />

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
    </>
  );
};

export default AdminCalendario;
