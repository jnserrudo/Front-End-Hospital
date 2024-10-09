import React, { useContext, useEffect, useState } from "react";
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

import RecetaContext from "../Contexts/RecetaContext";
import { VentEmergenteAddReceta } from "./VentEmergenteAddReceta";
import { VentEmergenteEditReceta } from "./VentEmergenteEditReceta";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import { inhabilitarRecetas } from "../services/recetas-services";
export const AdminReceta = () => {
  const {
    db,
    dbSearch,
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
  const [recetaSearch, setRecetaSearch] = useState("");


  useEffect(() => {
    //necesito saber el rol del usuario, si es 3 es paciente
    if (localStorage.getItem("rol") == 3) {
      //es paciente traemos las reservas
      setNdocuPaciente(localStorage.getItem("dni"));
    }
  }, []);

  return (
    <div className="form form_admin">
      <p className="titulo_administracion">Recetas</p>

      <Button
        className="btn_agregar"
        colorScheme="green"
        onClick={() => setShowVentEmergenteAddReceta(true)}
      >
        Agregar Receta <UserAddOutlined className="icons" />
      </Button>

      <FormControl className="buscador" variant="floating" id="recetaSearch">
        <InputGroup>
          <Input
            placeholder=""
            name="recetaSearch"
            type="text"
            value={recetaSearch}
            onChange={(e) => {
              setRecetaSearch(e.target.value);
              handleSearch(
                e.target.value,
                db
              );
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

        dataSource={ dbSearch.length>0 ? dbSearch : db}
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
