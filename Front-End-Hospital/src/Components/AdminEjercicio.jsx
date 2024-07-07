import React, { useContext } from "react";
import { Table } from "antd";
import { EditOutlined, DragOutlined } from "@ant-design/icons";
import { Button, ButtonGroup } from '@chakra-ui/react'
import { UserAddOutlined, SearchOutlined } from "@ant-design/icons";

import EjercicioContext from "../Contexts/EjercicioContext";
import { VentEmergenteAddEjercicio } from "./VentEmergenteAddEjercicio";
import { VentEmergenteEditEjercicio } from "./VentEmergenteEditEjercicio";
export const AdminEjercicio = () => {
  const {
    db=[],
    columns,
    ejercicioSelected,
    showVentEmergenteEditEjercicio,
    handleCloseVentEmergenteEditEjercicio,
    showVentEmergenteAddEjercicio,
    setShowVentEmergenteAddEjercicio,
    handleCloseVentEmergenteAddEjercicio,
    handleSearch,
  } = useContext(EjercicioContext);
  
console.log(db,columns)
  return (
    <div>
      <Button
        className="btn_agregar"
        colorScheme='green'
        onClick={() => setShowVentEmergenteAddEjercicio(true)}
      >
        Agregar Ejercicio <UserAddOutlined className="icons" />
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

      <VentEmergenteAddEjercicio
        isOpen={showVentEmergenteAddEjercicio}
        onClose={handleCloseVentEmergenteAddEjercicio}
      />

      <VentEmergenteEditEjercicio
        isOpen={showVentEmergenteEditEjercicio}
        ejercicioSelected={ejercicioSelected}
        onClose={handleCloseVentEmergenteEditEjercicio}
      />
    </div>
  );
};
