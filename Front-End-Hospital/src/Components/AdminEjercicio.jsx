import React, { useContext, useMemo, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";

import EjercicioContext from "../Contexts/EjercicioContext";
import { VentEmergenteAddEjercicio } from "./VentEmergenteAddEjercicio";
import { VentEmergenteEditEjercicio } from "./VentEmergenteEditEjercicio";
import { inhabilitarEjercicio } from "../services/ejercicio-services";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import { AdminEntityList } from "./AdminEntityList";
import { filterBySearch } from "../utils/search";
import { notify } from "../ui/notify";

export const AdminEjercicio = () => {
  const {
    db = [],
    dbSearch,
    columns,
    ejercicioSelected,
    showVentEmergenteEditEjercicio,
    handleCloseVentEmergenteEditEjercicio,
    showVentEmergenteAddEjercicio,
    setShowVentEmergenteAddEjercicio,
    handleCloseVentEmergenteAddEjercicio,
    handleSearch,
    idEjercicio,
    showVentEmergenteDelete,
    setShowVentEmergenteDelete,
    loading = false,
    loadingAction = false,
    recargar,
  } = useContext(EjercicioContext);

  const inhabilitarRegistro = async (id) => {
    await inhabilitarEjercicio(id);
  };
  const [ejercicioSearch, setEjercicioSearch] = useState("");

  const lista = useMemo(() => filterBySearch(db || [], ejercicioSearch), [db, ejercicioSearch]);
  const itemNombre = (db || []).find((x) => x.id === idEjercicio)?.nombre || "seleccionado";

  return (
    <>
      <AdminEntityList
        title="Listado de Ejercicios"
        count={db?.length || 0}
        searchProps={{
          placeholder: "Buscar ejercicio...",
          value: ejercicioSearch,
          onChange: (e) => {
            setEjercicioSearch(e.target.value);
          },
        }}
        addButton={{
          label: "Agregar ejercicio",
          icon: <PlusOutlined />,
          onClick: () => setShowVentEmergenteAddEjercicio(true),
          loading: loadingAction,
          disabled: loadingAction,
        }}
        columns={columns}
        dataSource={lista}
        loadingText="Cargando ejercicios…"
        estado={{ entidad: "ejercicios", singular: "ejercicio", articulo: "el", onRestored: () => recargar?.() }}
        loading={loading}
        rowKey="id"
      />

      <VentEmergenteAddEjercicio
        isOpen={showVentEmergenteAddEjercicio}
        onClose={handleCloseVentEmergenteAddEjercicio}
      />

      <VentEmergenteEditEjercicio
        isOpen={showVentEmergenteEditEjercicio}
        ejercicioSelected={ejercicioSelected}
        onClose={handleCloseVentEmergenteEditEjercicio}
      />

      <VentEmergConfirmacion
        title={`¿Deshabilitar el ejercicio «${itemNombre}»?`}
        mje={"Deja de mostrarse en la sección Ejercicios para todos los pacientes. Los datos no se borran y se puede volver a habilitar desde el filtro «Deshabilitados»."}
        confirmText="Deshabilitar"
        danger
        errorFallback="No pudimos deshabilitar el ejercicio"
        isOpen={showVentEmergenteDelete}
        onClose={() => setShowVentEmergenteDelete(false)}
        handleSi={async () => {
          const nombreItem = itemNombre;
          await inhabilitarRegistro(idEjercicio);
          notify.success(`Ejercicio «${nombreItem}» deshabilitado. Ya no se muestra en la app.`);
        }}
      />
    </>
  );
};
