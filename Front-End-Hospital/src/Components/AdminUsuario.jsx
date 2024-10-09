import React, { useContext, useState } from "react";
import { Table } from "antd";
import { EditOutlined, DragOutlined } from "@ant-design/icons";
import {
  Button,
  ButtonGroup,
  Input,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { UserAddOutlined, SearchOutlined } from "@ant-design/icons";

import UsuarioContext from "../Contexts/UsuarioContext";
import { VentEmergenteAddUsuario } from "./VentEmergenteAddUsuario";
import { VentEmergenteEditUsuario } from "./VentEmergenteEditUsuario";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import { inhabilitarUsuario } from "../services/usuario-services";
export const AdminUsuario = () => {
  const {
    db,
    dbSearch,
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
  console.log(db, columns);

  const inhabilitarRegistro = async (id) => {
    console.log("inhabilitarRegistro: ", id);
    const result = await inhabilitarUsuario(id);
    console.log("resultado de inhabilitar: ", result);
  };
  const [usuarioSearch, setUsuarioSearch] = useState("");

  return (
    <div className="form form_admin" >
      <p className="titulo_administracion">Usuarios</p>

      <Button
        className="btn_agregar"
        colorScheme="green"
        onClick={() => setShowVentEmergenteAddUsuario(true)}
      >
        Agregar Usuario <UserAddOutlined className="icons" />
      </Button>
      
      <FormControl className="buscador" variant="floating" id="recetaSearch">
        <InputGroup>
          <Input
            placeholder=""
            name="usuarioSearch"
            type="text"
            value={usuarioSearch}
            onChange={(e) => {
              setUsuarioSearch(e.target.value);
              handleSearch(e.target.value);
            }}
          />
          <InputRightElement
            width="4.5rem"
            style={{ color: "#046ba3", fontSize: "20px" }}
          >
            <SearchOutlined />
          </InputRightElement>
        </InputGroup>

        <FormLabel></FormLabel>
      </FormControl>
      <Table
        className="tabla"
        columns={columns}
        /* pagination={{
      position: [top, bottom],
    }} */
        pagination={{ position: ["none", "bottomRight"], pageSize: 5 }}
        /* el pageSize determina la cantidad filas por tabla */

        dataSource={dbSearch.length > 0 ? dbSearch : db}
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
        handleSi={() => inhabilitarRegistro(idUsuario)}
      />
    </div>
  );
};
