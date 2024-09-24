import React, { useContext, useEffect } from "react";
import { Table } from "antd";
import { EditOutlined, DragOutlined } from "@ant-design/icons";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { UserAddOutlined, SearchOutlined } from "@ant-design/icons";

import RecetaContext from "../Contexts/RecetaContext";
import { VentEmergenteAddReceta } from "./VentEmergenteAddReceta";
import { VentEmergenteEditReceta } from "./VentEmergenteEditReceta";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import { inhabilitarRecetas } from "../services/recetas-services";
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
    setNdocuPaciente,
    idReceta,
    showVentEmergenteDelete,
    setShowVentEmergenteDelete,
  } = useContext(RecetaContext);

  const inhabilitarRegistro = async (id) => {
    console.log("inhabilitarRegistro: ", id);
    const result = await inhabilitarRecetas(id);
    console.log("resultado de inhabilitar: ", result);
  };

  useEffect(() => {
    //necesito saber el rol del usuario, si es 3 es paciente
    if (localStorage.getItem("rol") == 3) {
      //es paciente traemos las reservas
      setNdocuPaciente(localStorage.getItem("dni"));
    }
  }, []);

  return (
    <div>
      <p className="titulo_administracion">Recetas</p>

      <Button
        className="btn_agregar"
        colorScheme="green"
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
      <VentEmergConfirmacion
        mje={"Esta seguro de eliminar este registro?"}
        isOpen={showVentEmergenteDelete}
        onClose={() => setShowVentEmergenteDelete(false)}
        handleSi={() => inhabilitarRegistro(idReceta)}
      />
    </div>
  );
};
