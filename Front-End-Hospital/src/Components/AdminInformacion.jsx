import React, { useContext } from "react";
import { Table } from "antd";
import { EditOutlined, DragOutlined } from "@ant-design/icons";
import { Button, ButtonGroup } from '@chakra-ui/react'
import { UserAddOutlined, SearchOutlined } from "@ant-design/icons";

import InformacionContext from "../Contexts/InformacionContext";
import { VentEmergenteAddInformacion } from "./VentEmergenteAddInformacion";
import { VentEmergenteEditInformacion } from "./VentEmergenteEditInformacion";
import { inhabilitarInformacion } from "../services/informacion-services";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
export const AdminInformacion = () => {
  const {
    db=[],
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
  } = useContext(InformacionContext);
console.log(db,columns)

const inhabilitarRegistro=async(id)=>{
  console.log("inhabilitarRegistro: ",id)
  const result=await inhabilitarInformacion(id)
  console.log("resultado de inhabilitar: ",result)

}

  return (
    <div>
            <p className='titulo_administracion'>Información</p>

      <Button
        className="btn_agregar"
        colorScheme='green'
        onClick={() => setShowVentEmergenteAddInformacion(true)}
      >
        Agregar Informacion <UserAddOutlined className="icons" />
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
        mje={"Esta seguro de eliminar este registro?"}
        isOpen={showVentEmergenteDelete}
        onClose={() => setShowVentEmergenteDelete(false)}
        handleSi={()=>inhabilitarRegistro(idInformacion)}
      />
    </div>
  );
};
