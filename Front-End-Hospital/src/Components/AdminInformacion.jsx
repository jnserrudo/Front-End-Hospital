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

import InformacionContext from "../Contexts/InformacionContext";
import { VentEmergenteAddInformacion } from "./VentEmergenteAddInformacion";
import { VentEmergenteEditInformacion } from "./VentEmergenteEditInformacion";
import { inhabilitarInformacion } from "../services/informacion-services";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
export const AdminInformacion = () => {
  const {
    db = [],
    dbSearch,
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
  console.log(db, columns);

  const inhabilitarRegistro = async (id) => {
    console.log("inhabilitarRegistro: ", id);
    const result = await inhabilitarInformacion(id);
    console.log("resultado de inhabilitar: ", result);
  };

  const [informacionSearch, setInformacionSearch] = useState("");


  return (
    <div  className="form form_admin">
      <p className="titulo_administracion">Información</p>

      <Button
        className="btn_agregar"
        colorScheme="green"
        onClick={() => setShowVentEmergenteAddInformacion(true)}
      >
        Agregar Informacion <UserAddOutlined className="icons" />
      </Button>
      <FormControl className="buscador" variant="floating" id="recetaSearch">
        <InputGroup>
          <Input
            placeholder=""
            name="informacionSearch"
            type="text"
            value={informacionSearch}
            onChange={(e) => {
              setInformacionSearch(e.target.value);
              handleSearch(e.target.value,db);
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

        dataSource={ dbSearch.length > 0 ? dbSearch : db}
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
        handleSi={() => inhabilitarRegistro(idInformacion)}
      />
    </div>
  );
};
