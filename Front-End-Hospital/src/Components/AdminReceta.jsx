import React, { useContext, useEffect } from "react";
import { Table } from "antd";
import { EditOutlined, DragOutlined } from "@ant-design/icons";
import { Button, ButtonGroup } from '@chakra-ui/react'
import { UserAddOutlined, SearchOutlined } from "@ant-design/icons";

import RecetaContext from "../Contexts/RecetaContext";
import { VentEmergenteAddReceta } from "./VentEmergenteAddReceta";
import { VentEmergenteEditReceta } from "./VentEmergenteEditReceta";
export const AdminReceta = () => {
  const {
    db,
    columns,
    recetaSelected,
    showVentEmergenteEditReceta,
    handleCloseVentEmergenteEditReceta,
    showVentEmergenteAddReceta,
    setShowVentEmergenteAddReceta,
    handleCloseVentEmergenteAddReceta,
    handleSearch,
    setNdocuPaciente
  } = useContext(RecetaContext);

  useEffect(()=>{
    //necesito saber el rol del usuario, si es 3 es paciente
    if(localStorage.getItem('rol')==3){
      //es paciente traemos las reservas
      setNdocuPaciente(localStorage.getItem('dni'))
      
    }

  },[])

  return (
    <div>
      <Button
        className="btn_agregar"
        colorScheme='green'
        onClick={() => setShowVentEmergenteAddReceta(true)}
      >
        Agregar Receta <UserAddOutlined className="icons" />
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

      <VentEmergenteAddReceta
        isOpen={showVentEmergenteAddReceta}
        onClose={handleCloseVentEmergenteAddReceta}
      />

      <VentEmergenteEditReceta
        isOpen={showVentEmergenteEditReceta}
        recetaSelected={recetaSelected}
        onClose={handleCloseVentEmergenteEditReceta}
      />
    </div>
  );
};
