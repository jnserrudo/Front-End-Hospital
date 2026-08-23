import React, { useContext, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";

import PatologiaContext from "../Contexts/PatologiaContext";
import { VentEmergenteAddPatologia } from "./VentEmergenteAddPatologia";
import { VentEmergenteEditPatologia } from "./VentEmergenteEditPatologia";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import { inhabilitarPatologia } from "../services/patologia-services";
import { AdminEntityList } from "./AdminEntityList";

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
  } = useContext(PatologiaContext);

  const inhabilitarRegistro = async (id) => {
    await inhabilitarPatologia(id);
  };

  const [patologiaSearch, setPatologiaSearch] = useState("");

  return (
    <>
      <AdminEntityList
        title="Listado de Patologías"
        count={db.length}
        searchProps={{
          placeholder: "Buscar patología...",
          value: patologiaSearch,
          onChange: (e) => {
            setPatologiaSearch(e.target.value);
            handleSearch(e.target.value);
          },
        }}
        addButton={{
          label: "Agregar Patología",
          icon: <PlusOutlined />,
          onClick: () => setShowVentEmergenteAddPatologia(true),
          loading: loadingAction,
          disabled: loadingAction,
        }}
        columns={columns}
        dataSource={dbSearch.length > 0 ? dbSearch : db}
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
        mje={"¿Está seguro de eliminar este registro?"}
        isOpen={showVentEmergenteDelete}
        onClose={() => setShowVentEmergenteDelete(false)}
        handleSi={() => inhabilitarRegistro(idPatologia)}
      />
    </>
  );
};
