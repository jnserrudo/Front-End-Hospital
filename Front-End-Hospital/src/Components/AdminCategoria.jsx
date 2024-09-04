import React, { useContext } from "react";
import { Table } from "antd";
import { EditOutlined, DragOutlined } from "@ant-design/icons";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { UserAddOutlined, SearchOutlined } from "@ant-design/icons";

import CategoriaContext from "../Contexts/CategoriaContext";
import { VentEmergenteAddCategoria } from "./VentEmergenteAddCategoria";
import { VentEmergenteEditCategoria } from "./VentEmergenteEditCategoria";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import { inhabilitarCategoria } from "../services/categoria-services";
export const AdminCategoria = () => {
  const {
    db,
    columns,
    categoriaSelected,
    showVentEmergenteEditCategoria,
    handleCloseVentEmergenteEditCategoria,
    showVentEmergenteAddCategoria,
    setShowVentEmergenteAddCategoria,
    handleCloseVentEmergenteAddCategoria,
    handleSearch,
    idCategoria,
    showVentEmergenteDelete,
    setShowVentEmergenteDelete,
  } = useContext(CategoriaContext);
  console.log(columns);

  const inhabilitarRegistro = async (id) => {
    console.log("inhabilitarRegistro: ", id);
    const result = await inhabilitarCategoria(id);
    console.log("resultado de inhabilitar: ", result);
  };

  return (
    <div>
      <p className="titulo_administracion">Categorias</p>
      <div className="cont_btn_agregar">
        <Button
          className="btn_agregar"
          colorScheme="green"
          onClick={() => setShowVentEmergenteAddCategoria(true)}
        >
          Agregar Categoria <UserAddOutlined className="icons" />
        </Button>
      </div>
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

      <VentEmergenteAddCategoria
        isOpen={showVentEmergenteAddCategoria}
        onClose={handleCloseVentEmergenteAddCategoria}
      />

      <VentEmergenteEditCategoria
        isOpen={showVentEmergenteEditCategoria}
        categoriaSelected={categoriaSelected}
        onClose={handleCloseVentEmergenteEditCategoria}
      />

      <VentEmergConfirmacion
        mje={"Esta seguro de eliminar este registro?"}
        isOpen={showVentEmergenteDelete}
        onClose={() => setShowVentEmergenteDelete(false)}
        handleSi={() => inhabilitarRegistro(idCategoria)}
      />
    </div>
  );
};
