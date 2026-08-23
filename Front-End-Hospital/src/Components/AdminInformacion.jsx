import React, { useContext, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";

import InformacionContext from "../Contexts/InformacionContext";
import { VentEmergenteAddInformacion } from "./VentEmergenteAddInformacion";
import { VentEmergenteEditInformacion } from "./VentEmergenteEditInformacion";
import { inhabilitarInformacion } from "../services/informacion-services";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import { AdminEntityList } from "./AdminEntityList";

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
  } = useContext(InformacionContext);

  const inhabilitarRegistro = async (id) => {
    await inhabilitarInformacion(id);
  };

  const [informacionSearch, setInformacionSearch] = useState("");

  return (
    <>
      <AdminEntityList
        title="Listado de Información"
        count={db.length}
        searchProps={{
          placeholder: "Buscar información...",
          value: informacionSearch,
          onChange: (e) => {
            setInformacionSearch(e.target.value);
            handleSearch(e.target.value, db);
          },
        }}
        addButton={{
          label: "Agregar Información",
          icon: <PlusOutlined />,
          onClick: () => setShowVentEmergenteAddInformacion(true),
          loading: loadingAction,
          disabled: loadingAction,
        }}
        columns={columns}
        dataSource={dbSearch.length > 0 ? dbSearch : db}
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
        mje={"¿Está seguro de eliminar este registro?"}
        isOpen={showVentEmergenteDelete}
        onClose={() => setShowVentEmergenteDelete(false)}
        handleSi={() => inhabilitarRegistro(idInformacion)}
      />
    </>
  );
};
