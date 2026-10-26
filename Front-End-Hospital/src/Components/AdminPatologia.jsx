import React, { useContext, useMemo, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";

import PatologiaContext from "../Contexts/PatologiaContext";
import { VentEmergenteAddPatologia } from "./VentEmergenteAddPatologia";
import { VentEmergenteEditPatologia } from "./VentEmergenteEditPatologia";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import { inhabilitarPatologia } from "../services/patologia-services";
import { AdminEntityList } from "./AdminEntityList";
import { filterBySearch } from "../utils/search";
import { notify } from "../ui/notify";

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
    recargar,
  } = useContext(PatologiaContext);

  const inhabilitarRegistro = async (id) => {
    await inhabilitarPatologia(id);
  };

  const [patologiaSearch, setPatologiaSearch] = useState("");

  const lista = useMemo(() => filterBySearch(db || [], patologiaSearch), [db, patologiaSearch]);
  const itemNombre = (db || []).find((x) => x.id === idPatologia)?.nombre || "seleccionada";

  return (
    <>
      <AdminEntityList
        title="Listado de Patologías"
        count={db?.length || 0}
        searchProps={{
          placeholder: "Buscar patología...",
          value: patologiaSearch,
          onChange: (e) => {
            setPatologiaSearch(e.target.value);
          },
        }}
        addButton={{
          label: "Agregar patología",
          icon: <PlusOutlined />,
          onClick: () => setShowVentEmergenteAddPatologia(true),
          loading: loadingAction,
          disabled: loadingAction,
        }}
        columns={columns}
        dataSource={lista}
        loadingText="Cargando patologías…"
        estado={{ entidad: "patologias", singular: "patología", articulo: "la", onRestored: () => recargar?.() }}
        loading={loading}
        rowKey="id"
      />

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
        title={`¿Deshabilitar la patología «${itemNombre}»?`}
        mje={"Ya no se va a poder asignar a pacientes ni a contenidos nuevos. Los pacientes y contenidos que ya la tienen no se borran. Podés volver a habilitarla desde el filtro «Deshabilitados»."}
        confirmText="Deshabilitar"
        danger
        errorFallback="No pudimos deshabilitar la patología"
        isOpen={showVentEmergenteDelete}
        onClose={() => setShowVentEmergenteDelete(false)}
        handleSi={async () => {
          const nombreItem = itemNombre;
          await inhabilitarRegistro(idPatologia);
          notify.success(`Patología «${nombreItem}» deshabilitada. Ya no se muestra en la app.`);
        }}
      />
    </>
  );
};
