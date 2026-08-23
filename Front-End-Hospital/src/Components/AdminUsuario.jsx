import React, { useContext, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";

import UsuarioContext from "../Contexts/UsuarioContext";
import { VentEmergenteAddUsuario } from "./VentEmergenteAddUsuario";
import { VentEmergenteEditUsuario } from "./VentEmergenteEditUsuario";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import { inhabilitarUsuario } from "../services/usuario-services";
import { AdminEntityList } from "./AdminEntityList";

export const AdminUsuario = () => {
  const {
    db,
    dbSearch,
    columns,
    usuarioSelected,
    showVentEmergenteEditUsuario,
    handleCloseVentEmergenteEditUsuario,
    showVentEmergenteAddUsuario,
    setShowVentEmergenteAddUsuario,
    handleCloseVentEmergenteAddUsuario,
    handleSearch,
    idUsuario,
    showVentEmergenteDelete,
    setShowVentEmergenteDelete,
    loading = false,
    loadingAction = false,
  } = useContext(UsuarioContext);

  const inhabilitarRegistro = async (id) => {
    await inhabilitarUsuario(id);
  };
  const [usuarioSearch, setUsuarioSearch] = useState("");

  return (
    <>
      <AdminEntityList
        title="Listado de Usuarios"
        count={db.length}
        searchProps={{
          placeholder: "Buscar usuario...",
          value: usuarioSearch,
          onChange: (e) => {
            setUsuarioSearch(e.target.value);
            handleSearch(e.target.value);
          },
        }}
        addButton={{
          label: "Agregar Usuario",
          icon: <PlusOutlined />,
          onClick: () => setShowVentEmergenteAddUsuario(true),
          loading: loadingAction,
          disabled: loadingAction,
        }}
        columns={columns}
        dataSource={dbSearch.length > 0 ? dbSearch : db}
        loading={loading}
        rowKey="id"
      />

      <VentEmergenteAddUsuario
        isOpen={showVentEmergenteAddUsuario}
        onClose={handleCloseVentEmergenteAddUsuario}
      />

      <VentEmergenteEditUsuario
        isOpen={showVentEmergenteEditUsuario}
        usuarioSelected={usuarioSelected}
        onClose={handleCloseVentEmergenteEditUsuario}
      />

      <VentEmergConfirmacion
        mje={"¿Está seguro de eliminar este registro?"}
        isOpen={showVentEmergenteDelete}
        onClose={() => setShowVentEmergenteDelete(false)}
        handleSi={() => inhabilitarRegistro(idUsuario)}
      />
    </>
  );
};
