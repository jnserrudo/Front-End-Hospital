import React, { useContext } from "react";
import { Table } from "antd";
import { EditOutlined, DragOutlined } from "@ant-design/icons";
import { Button, ButtonGroup } from '@chakra-ui/react'
import { UserAddOutlined, SearchOutlined } from "@ant-design/icons";

import PatologiaContext from "../Contexts/PatologiaContext";
import { VentEmergenteAddPatologia } from "./VentEmergenteAddPatologia";
import { VentEmergenteEditPatologia } from "./VentEmergenteEditPatologia";
export const AdminPatologia = () => {
  const {
    
    columns,
    patologiaSelected,
    showVentEmergenteEditPatologia,
    handleCloseVentEmergenteEditPatologia,
    showVentEmergenteAddPatologia,
    setShowVentEmergenteAddPatologia,
    handleCloseVentEmergenteAddPatologia,
    handleSearch,
  } = useContext(PatologiaContext);
console.log(columns)
  return (
    <div>
      <Button
        className="btn_agregar_patologia"
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

        /* dataSource={dbSearch.length > 0 ? dbSearch : db} */
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
    </div>
  );
};
