import React, { useContext, useEffect, useMemo, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import RecetaContext from "../Contexts/RecetaContext";
import { VentEmergenteAddReceta } from "./VentEmergenteAddReceta";
import { VentEmergenteEditReceta } from "./VentEmergenteEditReceta";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import { inhabilitarRecetas } from "../services/recetas-services";
import { AdminEntityList } from "./AdminEntityList";
import { filterBySearch } from "../utils/search";
import { notify } from "../ui/notify";

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
    recargar,
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

  const lista = useMemo(() => filterBySearch(db || [], recetaSearch), [db, recetaSearch]);
  const itemNombre = (db || []).find((x) => x.id === idReceta)?.nombre || "seleccionada";

  return (
    <>
      <AdminEntityList
        title="Listado de Recetas"
        count={db?.length || 0}
        searchProps={{
          placeholder: "Buscar receta...",
          value: recetaSearch,
          onChange: (e) => {
            setRecetaSearch(e.target.value);
          },
        }}
        addButton={{
          label: "Agregar receta",
          icon: <PlusOutlined />,
          onClick: () => setShowVentEmergenteAddReceta(true),
          loading: loadingAction,
          disabled: loadingAction,
        }}
        columns={columns}
        dataSource={lista}
        loadingText="Cargando recetas…"
        estado={{ entidad: "recetas", singular: "receta", articulo: "la", onRestored: () => recargar?.() }}
        loading={loading}
        rowKey="id"
      />

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
        title={`¿Deshabilitar la receta «${itemNombre}»?`}
        mje={"Deja de mostrarse en la sección Recetas para todos los pacientes. Los datos no se borran y se puede volver a habilitar desde el filtro «Deshabilitados»."}
        confirmText="Deshabilitar"
        danger
        errorFallback="No pudimos deshabilitar la receta"
        isOpen={showVentEmergenteDelete}
        onClose={() => setShowVentEmergenteDelete(false)}
        handleSi={async () => {
          const nombreItem = itemNombre;
          await inhabilitarRegistro(idReceta);
          notify.success(`Receta «${nombreItem}» deshabilitada. Ya no se muestra en la app.`);
        }}
      />
    </>
  );
};
