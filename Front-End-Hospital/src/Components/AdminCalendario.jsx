import React, { useContext, useMemo, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import CalendarioContext from "../Contexts/CalendarioContext";
import { VentEmergenteAddEvento } from "./VentEmergenteAddEvento";
import { VentEmergenteEditEvento } from "./VentEmergenteEditEvento";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import { AdminEntityList } from "./AdminEntityList";
import { filterBySearch } from "../utils/search";
import { notify } from "../ui/notify";

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
    recargar,
  } = useContext(CalendarioContext);

  const [eventoSearch, setEventoSearch] = useState("");

  const lista = useMemo(() => filterBySearch(db || [], eventoSearch), [db, eventoSearch]);
  const itemNombre = (db || []).find((x) => x.id === idEvento)?.titulo || "seleccionado";

  return (
    <>
      <AdminEntityList
        title="Listado de Eventos"
        count={db?.length || 0}
        searchProps={{
          placeholder: "Buscar evento...",
          value: eventoSearch,
          onChange: (e) => {
            setEventoSearch(e.target.value);
          },
        }}
        addButton={{
          label: "Agregar evento",
          icon: <PlusOutlined />,
          onClick: () => setShowVentEmergenteAddEvento(true),
          loading: loadingAction,
          disabled: loadingAction,
        }}
        columns={columns}
        dataSource={lista}
        loadingText="Cargando eventos…"
        estado={{ entidad: "calendario", singular: "evento", articulo: "el", onRestored: () => recargar?.() }}
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
        title={`¿Deshabilitar el evento «${itemNombre}»?`}
        mje={"Deja de mostrarse en el calendario para todos. Los datos no se borran y se puede volver a habilitar desde el filtro «Deshabilitados»."}
        confirmText="Deshabilitar"
        danger
        errorFallback="No pudimos deshabilitar el evento"
        isOpen={showVentEmergenteDelete}
        onClose={() => setShowVentEmergenteDelete(false)}
        handleSi={async () => {
          const nombreItem = itemNombre;
          await inhabilitarEvento(idEvento);
          notify.success(`Evento «${nombreItem}» deshabilitado. Ya no se muestra en la app.`);
        }}
      />
    </>
  );
};

export default AdminCalendario;
