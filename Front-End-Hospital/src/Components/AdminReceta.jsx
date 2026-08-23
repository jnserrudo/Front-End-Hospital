import React, { useContext, useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import RecetaContext from "../Contexts/RecetaContext";
import { VentEmergenteAddReceta } from "./VentEmergenteAddReceta";
import { VentEmergenteEditReceta } from "./VentEmergenteEditReceta";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import { inhabilitarRecetas } from "../services/recetas-services";
import { AdminEntityList } from "./AdminEntityList";

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

  return (
    <>
      <AdminEntityList
        title="Listado de Recetas"
        count={db.length}
        searchProps={{
          placeholder: "Buscar receta...",
          value: recetaSearch,
          onChange: (e) => {
            setRecetaSearch(e.target.value);
            handleSearch(e.target.value, db);
          },
        }}
        addButton={{
          label: "Agregar Receta",
          icon: <PlusOutlined />,
          onClick: () => setShowVentEmergenteAddReceta(true),
          loading: loadingAction,
          disabled: loadingAction,
        }}
        columns={columns}
        dataSource={dbSearch.length > 0 ? dbSearch : db}
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
        mje={"¿Está seguro de eliminar este registro?"}
        isOpen={showVentEmergenteDelete}
        onClose={() => setShowVentEmergenteDelete(false)}
        handleSi={() => inhabilitarRegistro(idReceta)}
      />
    </>
  );
};
