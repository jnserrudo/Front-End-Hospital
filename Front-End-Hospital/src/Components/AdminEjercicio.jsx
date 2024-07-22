import React, { useContext } from "react";
import { Table } from "antd";
import { EditOutlined, DragOutlined } from "@ant-design/icons";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { UserAddOutlined, SearchOutlined } from "@ant-design/icons";

import EjercicioContext from "../Contexts/EjercicioContext";
import { VentEmergenteAddEjercicio } from "./VentEmergenteAddEjercicio";
import { VentEmergenteEditEjercicio } from "./VentEmergenteEditEjercicio";
import { inhabilitarEjercicio } from "../services/ejercicio-services";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
export const AdminEjercicio = () => {
  const {
    db = [],
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
  } = useContext(EjercicioContext);

  const inhabilitarRegistro = async (id) => {
    console.log("inhabilitarRegistro: ", id);
    const result = await inhabilitarEjercicio(id);
    console.log("resultado de inhabilitar: ", result);
  };

  console.log(db, columns);
  return (
    <div>
            <p className='titulo_administracion'>Ejercicio</p>

      <Button
        className="btn_agregar"
        colorScheme="green"
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

      <VentEmergConfirmacion
        mje={"Esta seguro de eliminar este registro?"}
        isOpen={showVentEmergenteDelete}
        onClose={() => setShowVentEmergenteDelete(false)}
        handleSi={() => inhabilitarRegistro(idEjercicio)}
      />
    </div>
  );
};
