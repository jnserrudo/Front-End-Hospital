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

import EjercicioContext from "../Contexts/EjercicioContext";
import { VentEmergenteAddEjercicio } from "./VentEmergenteAddEjercicio";
import { VentEmergenteEditEjercicio } from "./VentEmergenteEditEjercicio";
import { inhabilitarEjercicio } from "../services/ejercicio-services";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
export const AdminEjercicio = () => {
  const {
    db = [],
    dbSearch,
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
  const [ejercicioSearch, setEjercicioSearch] = useState("");

  console.log(db, columns);
  return (
    <div className="form form_admin" >
      <p className="titulo_administracion">Ejercicio</p>

      <Button
        className="btn_agregar"
        colorScheme="green"
        onClick={() => setShowVentEmergenteAddEjercicio(true)}
      >
        Agregar Ejercicio <UserAddOutlined className="icons" />
      </Button>
      <FormControl className="buscador" variant="floating" id="recetaSearch">
        <InputGroup>
          <Input
            placeholder=""
            name="ejercicioSearch"
            type="text"
            value={ejercicioSearch}
            onChange={(e) => {
              setEjercicioSearch(e.target.value);
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
