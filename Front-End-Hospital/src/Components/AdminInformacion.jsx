import React, { useContext, useMemo, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";

import InformacionContext from "../Contexts/InformacionContext";
import { VentEmergenteAddInformacion } from "./VentEmergenteAddInformacion";
import { VentEmergenteEditInformacion } from "./VentEmergenteEditInformacion";
import { inhabilitarInformacion } from "../services/informacion-services";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import { AdminEntityList } from "./AdminEntityList";
import { filterBySearch } from "../utils/search";
import { notify } from "../ui/notify";

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
    recargar,
  } = useContext(InformacionContext);

  const inhabilitarRegistro = async (id) => {
    await inhabilitarInformacion(id);
  };

  const [informacionSearch, setInformacionSearch] = useState("");

  const lista = useMemo(() => filterBySearch(db || [], informacionSearch), [db, informacionSearch]);
  const itemNombre = (db || []).find((x) => x.id === idInformacion)?.nombre || "seleccionada";

  return (
    <>
      <AdminEntityList
        title="Listado de Información"
        count={db?.length || 0}
        searchProps={{
          placeholder: "Buscar información...",
          value: informacionSearch,
          onChange: (e) => {
            setInformacionSearch(e.target.value);
          },
        }}
        addButton={{
          label: "Agregar información",
          icon: <PlusOutlined />,
          onClick: () => setShowVentEmergenteAddInformacion(true),
          loading: loadingAction,
          disabled: loadingAction,
        }}
        columns={columns}
        dataSource={lista}
        loadingText="Cargando información…"
        estado={{ entidad: "informacion", singular: "información", articulo: "la", onRestored: () => recargar?.() }}
        loading={loading}
        rowKey="id"
      />

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
        title={`¿Deshabilitar la información «${itemNombre}»?`}
        mje={"Deja de mostrarse en la sección Información para todos los pacientes. Los datos no se borran y se puede volver a habilitar desde el filtro «Deshabilitados»."}
        confirmText="Deshabilitar"
        danger
        errorFallback="No pudimos deshabilitar la información"
        isOpen={showVentEmergenteDelete}
        onClose={() => setShowVentEmergenteDelete(false)}
        handleSi={async () => {
          const nombreItem = itemNombre;
          await inhabilitarRegistro(idInformacion);
          notify.success(`Información «${nombreItem}» deshabilitada. Ya no se muestra en la app.`);
        }}
      />
    </>
  );
};
