import React, { useContext } from "react";
import { Table } from "antd";
import { EditOutlined, DragOutlined } from "@ant-design/icons";
import { Button, ButtonGroup } from '@chakra-ui/react'
import { UserAddOutlined, SearchOutlined } from "@ant-design/icons";

import PatologiaContext from "../Contexts/PatologiaContext";
import { VentEmergenteAddPatologia } from "./VentEmergenteAddPatologia";
import { VentEmergenteEditPatologia } from "./VentEmergenteEditPatologia";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import { inhabilitarPatologia } from "../services/patologia-services";
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
  } = useContext(PatologiaContext);
console.log(columns)

const inhabilitarRegistro=async(id)=>{
  console.log("inhabilitarRegistro: ",id)
  const result=await inhabilitarPatologia(id)
  console.log("resultado de inhabilitar: ",result)

}

  return (
    <div>
      <p className='titulo_administracion'>Patologias</p>
      <Button
        className="btn_agregar"
        colorScheme='green'
        onClick={() => setShowVentEmergenteAddPatologia(true)}
      >
        Agregar Patologia <UserAddOutlined className="icons" />
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
        mje={"Esta seguro de eliminar este registro?"}
        isOpen={showVentEmergenteDelete}
        onClose={() => setShowVentEmergenteDelete(false)}
        handleSi={()=>inhabilitarRegistro(idPatologia)}
      />
    </div>
  );
};
