import {
  Button,
  ButtonGroup,
  Textarea,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { Space } from "antd";
import React, { useContext, useEffect, useState } from "react";
import "../style.css";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";

import PatologiasContext from "../Contexts/PatologiaContext";
import { useNavigate } from "react-router-dom";
import { Input } from "@chakra-ui/react";

export const EditPatologia = ({ patologia, onCloseEdit }) => {
  console.log("edit patologia: ", patologia);

  const navigate = useNavigate();
  const handleShowConsulta = (ndocu) => {
    navigate("/patologia/" + ndocu);
  };

  const [bandEdit, setBandEdit] = useState(false);
  const [bandUpdated, setBandUpdated] = useState(false);
  const [showVentEmergenteConfirmacion, setShowVentEmergenteConfirmacion] =
    useState(false);

  const { handleChangeInput, handleUpdate } = useContext(PatologiasContext);
  if (!patologia) {
    return null;
  }

  console.log("viendo al patologia: ", patologia);
  useEffect(() => {
    setBandUpdated(bandEdit);
  }, [bandEdit]);

  return (
    <div className="form_edit_patologia">
      {/* <h2>
        {patologia.nombre} {patologia.apellido}{" "}
      </h2>
 */}
      <div className="">
        <FormControl
          className="cont_input_edit"
          variant="floating"
          id="nombre"
          isRequired
        >
          <Input
            className={`input_edit ${!bandEdit ? "input_disabled" : ""}`}
            label="Nombre"
            name="nombre"
            variant="outlined"
            type="text"
            disabled={!bandEdit}
            value={patologia.nombre ? patologia.nombre : ""}
            onChange={(e) => handleChangeInput(e)}
          />
          <FormLabel>Nombre</FormLabel>
        </FormControl>
        <FormControl
          className="cont_input_edit"
          variant="floating"
          id="descripcion"
          isRequired
        >
          <Textarea
            className={`input_edit ${!bandEdit ? "input_disabled" : ""}`}
            label="Descripcion"
            name="descripcion"
            size="sm"
            variant="outlined"
            type="text"
            disabled={!bandEdit}
            value={patologia.descripcion ? patologia.descripcion : ""}
            onChange={(e) => handleChangeInput(e)}
          />
          <FormLabel>Descripción</FormLabel>
        </FormControl>
      </div>

      <div className="cont_btns_acciones_patologia">
        {!bandEdit ? (
          <Button
            className="btn_accion_edit_patologia"
            /* variant="outlined" */
            colorScheme="blue"
            onClick={() => setBandEdit(true)}
          >
            Editar
          </Button>
        ) : (
          <Button
            className="btn_accion_edit_patologia"
            /* variant="contained" */
            color="info"
            onClick={() => setBandEdit(false)}
          >
            Cancelar
          </Button>
        )}
      
      {bandUpdated ? (
        <Button
          className="btn_accion_edit_patologia"
          colorScheme="green"
          /* variant="contained"
          style={{ margin: "1rem auto 0" }} */
          onClick={() => setShowVentEmergenteConfirmacion(true)}
        >
          Actualizar
        </Button>
      ) : null}
      </div>

      

      <VentEmergConfirmacion
        onClosePadre={onCloseEdit}
        onClose={() => setShowVentEmergenteConfirmacion(false)}
        mje={
          "Esta seguro de actualizar los datos del patologia " +
          /*  patologia?.nombre?.toUpperCase() +
          ", " +
          patologia?.apellido?.toUpperCase() + */
          " ?"
        }
        handleSi={() => handleUpdate(patologia)}
        isOpen={showVentEmergenteConfirmacion}
      />
    </div>
  );
};

/* 
<TextField
                className="input_carga plan_anioc_edicion_input"
                id="outlined-basic"
                label="Año de Cursado"
                variant="outlined"
                name="añoc"
                type="number"
                onChange={(e) => {
                  handleChange(e);
                  setCurso({
                    ...curso,
                    añoc: e.target.value,
                  });
                }}
                onBlur={() => handleBlurElementosForm("añoc")}
                value={curso.añoc ? curso.añoc : ""}
              />
*/
