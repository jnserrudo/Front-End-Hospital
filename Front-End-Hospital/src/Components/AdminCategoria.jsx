import React, { useContext, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";

import CategoriaContext from "../Contexts/CategoriaContext";
import { VentEmergenteAddCategoria } from "./VentEmergenteAddCategoria";
import { VentEmergenteEditCategoria } from "./VentEmergenteEditCategoria";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import { inhabilitarCategoria } from "../services/categoria-services";
import { AdminEntityList } from "./AdminEntityList";

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
  } = useContext(CategoriaContext);

  const inhabilitarRegistro = async (id) => {
    await inhabilitarCategoria(id);
  };

  const [categoriaSearch, setCategoriaSearch] = useState("");

  return (
    <>
      <AdminEntityList
        title="Listado de Categorías"
        count={db.length}
        searchProps={{
          placeholder: "Buscar categoría...",
          value: categoriaSearch,
          onChange: (e) => {
            setCategoriaSearch(e.target.value);
            handleSearch(e.target.value);
          },
        }}
        addButton={{
          label: "Agregar Categoría",
          icon: <PlusOutlined />,
          onClick: () => setShowVentEmergenteAddCategoria(true),
          loading: loadingAction,
          disabled: loadingAction,
        }}
        columns={columns}
        dataSource={dbSearch.length > 0 ? dbSearch : db}
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
        mje={"¿Está seguro de eliminar este registro?"}
        isOpen={showVentEmergenteDelete}
        onClose={() => setShowVentEmergenteDelete(false)}
        handleSi={() => inhabilitarRegistro(idCategoria)}
      />
    </>
  );
};
