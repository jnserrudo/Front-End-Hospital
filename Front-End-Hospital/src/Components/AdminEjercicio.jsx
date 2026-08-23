import React, { useContext, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";

import EjercicioContext from "../Contexts/EjercicioContext";
import { VentEmergenteAddEjercicio } from "./VentEmergenteAddEjercicio";
import { VentEmergenteEditEjercicio } from "./VentEmergenteEditEjercicio";
import { inhabilitarEjercicio } from "../services/ejercicio-services";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import { AdminEntityList } from "./AdminEntityList";

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
  } = useContext(EjercicioContext);

  const inhabilitarRegistro = async (id) => {
    await inhabilitarEjercicio(id);
  };
  const [ejercicioSearch, setEjercicioSearch] = useState("");

  return (
    <>
      <AdminEntityList
        title="Listado de Ejercicios"
        count={db.length}
        searchProps={{
          placeholder: "Buscar ejercicio...",
          value: ejercicioSearch,
          onChange: (e) => {
            setEjercicioSearch(e.target.value);
            handleSearch(e.target.value, db);
          },
        }}
        addButton={{
          label: "Agregar Ejercicio",
          icon: <PlusOutlined />,
          onClick: () => setShowVentEmergenteAddEjercicio(true),
          loading: loadingAction,
          disabled: loadingAction,
        }}
        columns={columns}
        dataSource={dbSearch.length > 0 ? dbSearch : db}
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
        mje={"¿Está seguro de eliminar este registro?"}
        isOpen={showVentEmergenteDelete}
        onClose={() => setShowVentEmergenteDelete(false)}
        handleSi={() => inhabilitarRegistro(idEjercicio)}
      />
    </>
  );
};
