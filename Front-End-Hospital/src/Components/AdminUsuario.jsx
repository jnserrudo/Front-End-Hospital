import React, { useContext } from "react";
import { Table } from "antd";
import { EditOutlined, DragOutlined } from "@ant-design/icons";
import { Button, ButtonGroup } from '@chakra-ui/react'
import { UserAddOutlined, SearchOutlined } from "@ant-design/icons";

import UsuarioContext from "../Contexts/UsuarioContext";
import { VentEmergenteAddUsuario } from "./VentEmergenteAddUsuario";
import { VentEmergenteEditUsuario } from "./VentEmergenteEditUsuario";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import { inhabilitarUsuario } from "../services/usuario-services";
export const AdminUsuario = () => {
  const {
    db,
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
  } = useContext(UsuarioContext);
console.log(db,columns)

const inhabilitarRegistro=async(id)=>{
  console.log("inhabilitarRegistro: ",id)
  const result=await inhabilitarUsuario(id)
  console.log("resultado de inhabilitar: ",result)

}

  return (
    <div>
            <p className='titulo_administracion'>Usuarios</p>

      <Button
        className="btn_agregar"
        colorScheme='green'
        onClick={() => setShowVentEmergenteAddUsuario(true)}
      >
        Agregar Usuario <UserAddOutlined className="icons" />
      </Button>
      <Table
        className="tabla"
        columns={columns}
        /* pagination={{
      position: [top, bottom],
    }} */
        pagination={{ position: ["none", "bottomRight"], pageSize: 5 }}
        /* el pageSize determina la cantidad filas por tabla */

        dataSource={db}
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
        mje={"Esta seguro de eliminar este registro?"}
        isOpen={showVentEmergenteDelete}
        onClose={() => setShowVentEmergenteDelete(false)}
        handleSi={()=>inhabilitarRegistro(idUsuario)}
      />
    </div>
  );
};
