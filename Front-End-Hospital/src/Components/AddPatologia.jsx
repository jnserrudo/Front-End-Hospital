
import React, { useContext, useEffect, useState } from "react";
import { Button, ButtonGroup } from '@chakra-ui/react'
import "../style.css";
import PatologiasContext from "../Contexts/PatologiaContext";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import { Input } from '@chakra-ui/react'
export const AddPatologia = () => {
  const {
    patologiaToInsert,
    handleChangeInputInsert,
    addPatologia,
    bandInsert,
    handleInsert,
    showVentEmergConfirmacion, 
    setShowVentEmergConfirmacion,
    handleCloseVentEmergConfirmacion
  } = useContext(PatologiasContext);

  const [showVentEmergenteVacunas, setShowVentEmergenteVacunas] =
    useState(false);
  const [showVentEmergenteAFP, setShowVentEmergenteAFP] = useState(false);
  const [showVentEmergenteAPP, setShowVentEmergenteAPP] = useState(false);
  const [showVentEmergenteAlergias, setShowVentEmergenteAlergias] = useState(false);



  const handleCloseVentEmergenteVacunas = () => {
    setShowVentEmergenteVacunas(false);
  };
  const handleCloseVentEmergenteAFP = () => {
    setShowVentEmergenteAFP(false);
  };
  const handleCloseVentEmergenteAPP = () => {
    setShowVentEmergenteAPP(false);
  };
  const handleCloseVentEmergenteAlergias = () => {
    setShowVentEmergenteAlergias(false);
  };
  return (
    <div className="form_edit_patologia">
      {/* <h2>
        {patologia.nombre} {patologia.apellido}{" "}
      </h2>
 */}
      <div className="cont_input_edit">
        <Input
          className={`input_edit`}
          placeholder="Nombre"
          name="nombre"
          variant="outlined"
          type="text"
          value={patologiaToInsert?.nombre ? patologiaToInsert.nombre : ""}
          onChange={(e) => handleChangeInputInsert(e)}
        />
        <Input
          className={`input_edit`}
          placeholder="Descripcion"
          name="descripcion"
          variant="outlined"
          type="text"
          value={patologiaToInsert?.apellido ? patologiaToInsert.apellido : ""}
          onChange={(e) => handleChangeInputInsert(e)}
        />
      </div>
     
      

      {bandInsert ? (
        <Button
          className="btn_accion_edit_patologia"
          colorScheme='green'
          style={{ margin: "1rem auto 0" }}
          onClick={() => setShowVentEmergConfirmacion(true)}
        >
          Agregar Patologia
        </Button>
      ) : null}

      <VentEmergConfirmacion
        isOpen={showVentEmergConfirmacion}
        onClose={handleCloseVentEmergConfirmacion}
        handleInsert={handleInsert}
      />
      
    </div>
  );
};
