import React, { useContext, useEffect, useState } from "react";
import { Table } from "antd";
import { EditOutlined, DragOutlined } from "@ant-design/icons";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { UserAddOutlined, SearchOutlined } from "@ant-design/icons";

import PacienteContext from "../Contexts/PacienteContext";
import { VentEmergenteEditPaciente } from "./VentEmergenteEditPaciente";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import { inhabilitarPaciente } from "../services/paciente-services";
export const AdminPaciente = ({selectedKey}) => {
  const {
    db,
    columns,
    pacienteSelected,
    showVentEmergenteEditPaciente,
    handleCloseVentEmergenteEditPaciente,
    showVentEmergenteAddPaciente,
    setShowVentEmergenteAddPaciente,
    handleCloseVentEmergenteAddPaciente,
    handleSearch,
    idPaciente,
    getallPacientes,
    showVentEmergenteDelete,
    setShowVentEmergenteDelete,
  } = useContext(PacienteContext);
  console.log(db, columns);

  const [showVentEmergenteConfirmacion, setShowVentEmergenteConfirmacion] =
    useState(false);
  const handleCloseVentEmergente = async () => {
    setShowVentEmergenteConfirmacion(false);
  };
  const inhabilitarRegistro = async (id) => {
    console.log("inhabilitarRegistro: ", id);
    const result = await inhabilitarPaciente(id);
    console.log("resultado de inhabilitar: ", result);
  };


  useEffect(() => {
    getallPacientes(); // Recargar pacientes
  }, [selectedKey]); // El efecto se ejecutará cada vez que selectedKey cambie
  return (
    <div>
      <p className="titulo_administracion">Pacientes</p>

      <Table
        className="tabla"
        columns={columns}
        /* pagination={{
      position: [top, bottom],
    }} */
        pagination={{ position: ["none", "bottomRight"], pageSize: 5 }}
        /* el pageSize determina la cantidad filas por tabla */

        dataSource={db.filter(pac=>pac?.usuario).map((pac)=>{
          return{
            id:pac?.id,
            ...pac?.usuario
          }
        })}
      />

      {/*  <VentEmergConfirmacion
        onClosePadre={onClosePadre}
        onClose={handleCloseVentEmergente}
        mje={"Esta seguro de agregar a la categoria? "}
        handleSi={handleInsert}
        isOpen={showVentEmergenteConfirmacion}
      /> */}
      
      <VentEmergenteEditPaciente
        isOpen={showVentEmergenteEditPaciente}
        pacienteSelected={pacienteSelected}
        onClose={handleCloseVentEmergenteEditPaciente}
      />

      <VentEmergConfirmacion
        mje={"Esta seguro de eliminar este registro?"}
        isOpen={showVentEmergenteDelete}
        onClose={() => setShowVentEmergenteDelete(false)}
        handleSi={() => inhabilitarRegistro(idPaciente)}
      />
    </div>
  );
};
