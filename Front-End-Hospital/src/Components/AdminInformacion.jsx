import React, { useContext } from "react";
import { Table } from "antd";
import { EditOutlined, DragOutlined } from "@ant-design/icons";
import { Button, ButtonGroup } from '@chakra-ui/react'
import { UserAddOutlined, SearchOutlined } from "@ant-design/icons";

import InformacionContext from "../Contexts/InformacionContext";
import { VentEmergenteAddInformacion } from "./VentEmergenteAddInformacion";
import { VentEmergenteEditInformacion } from "./VentEmergenteEditInformacion";
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
  } = useContext(InformacionContext);
console.log(db,columns)
  return (
    <div>
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
    </div>
  );
};
