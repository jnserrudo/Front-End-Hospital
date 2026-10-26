import React, { useContext, useMemo, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";

import CategoriaContext from "../Contexts/CategoriaContext";
import { VentEmergenteAddCategoria } from "./VentEmergenteAddCategoria";
import { VentEmergenteEditCategoria } from "./VentEmergenteEditCategoria";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import { inhabilitarCategoria } from "../services/categoria-services";
import { AdminEntityList } from "./AdminEntityList";
import { filterBySearch } from "../utils/search";
import { notify } from "../ui/notify";

export const AdminCategoria = () => {
  const {
    db,
    dbSearch,
    columns,
    categoriaSelected,
    showVentEmergenteEditCategoria,
    handleCloseVentEmergenteEditCategoria,
    showVentEmergenteAddCategoria,
    setShowVentEmergenteAddCategoria,
    handleCloseVentEmergenteAddCategoria,
    handleSearch,
    idCategoria,
    showVentEmergenteDelete,
    setShowVentEmergenteDelete,
    loading = false,
    loadingAction = false,
    recargar,
  } = useContext(CategoriaContext);

  const inhabilitarRegistro = async (id) => {
    await inhabilitarCategoria(id);
  };

  const [categoriaSearch, setCategoriaSearch] = useState("");

  const lista = useMemo(() => filterBySearch(db || [], categoriaSearch), [db, categoriaSearch]);
  const itemNombre = (db || []).find((x) => x.id === idCategoria)?.nombre || "seleccionada";

  return (
    <>
      <AdminEntityList
        title="Listado de Categorías"
        count={db?.length || 0}
        searchProps={{
          placeholder: "Buscar categoría...",
          value: categoriaSearch,
          onChange: (e) => {
            setCategoriaSearch(e.target.value);
          },
        }}
        addButton={{
          label: "Agregar categoría",
          icon: <PlusOutlined />,
          onClick: () => setShowVentEmergenteAddCategoria(true),
          loading: loadingAction,
          disabled: loadingAction,
        }}
        columns={columns}
        dataSource={lista}
        loadingText="Cargando categorías…"
        estado={{ entidad: "categorias", singular: "categoría", articulo: "la", onRestored: () => recargar?.() }}
        loading={loading}
        rowKey="id"
      />

      <VentEmergenteAddCategoria
        isOpen={showVentEmergenteAddCategoria}
        onClose={handleCloseVentEmergenteAddCategoria}
      />

      <VentEmergenteEditCategoria
        isOpen={showVentEmergenteEditCategoria}
        categoriaSelected={categoriaSelected}
        onClose={handleCloseVentEmergenteEditCategoria}
      />

      <VentEmergConfirmacion
        title={`¿Deshabilitar la categoría «${itemNombre}»?`}
        mje={"Ya no se va a poder elegir al cargar contenidos. Los contenidos que ya la tienen no se borran. Podés volver a habilitarla desde el filtro «Deshabilitados»."}
        confirmText="Deshabilitar"
        danger
        errorFallback="No pudimos deshabilitar la categoría"
        isOpen={showVentEmergenteDelete}
        onClose={() => setShowVentEmergenteDelete(false)}
        handleSi={async () => {
          const nombreItem = itemNombre;
          await inhabilitarRegistro(idCategoria);
          notify.success(`Categoría «${nombreItem}» deshabilitada. Ya no se muestra en la app.`);
        }}
      />
    </>
  );
};
