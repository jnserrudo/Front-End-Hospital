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
  
  import EjerciciosContext from "../Contexts/EjercicioContext";
  import { useNavigate } from "react-router-dom";
  import { Input } from "@chakra-ui/react";
  
  export const EditEjercicio = ({ ejercicio, onCloseEdit }) => {
    console.log("edit ejercicio: ", ejercicio);
  
    const navigate = useNavigate();
    const handleShowConsulta = (ndocu) => {
      navigate("/ejercicio/" + ndocu);
    };
  
    const [bandEdit, setBandEdit] = useState(false);
    const [bandUpdated, setBandUpdated] = useState(false);
    const [showVentEmergenteConfirmacion, setShowVentEmergenteConfirmacion] =
      useState(false);
  
    const { handleChangeInput, handleUpdate } = useContext(EjerciciosContext);
    if (!ejercicio) {
      return null;
    }
  
    console.log("viendo al ejercicio: ", ejercicio);
    useEffect(() => {
      setBandUpdated(bandEdit);
    }, [bandEdit]);
  
    return (
      <div className="form_edit_ejercicio">
        {/* <h2>
          {ejercicio.nombre} {ejercicio.apellido}{" "}
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
              value={ejercicio.nombre ? ejercicio.nombre : ""}
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
              value={ejercicio.descripcion ? ejercicio.descripcion : ""}
              onChange={(e) => handleChangeInput(e)}
            />
            <FormLabel>Descripción</FormLabel>
          </FormControl>
        </div>
  
        <div className="cont_btns_acciones_ejercicio">
          {!bandEdit ? (
            <Button
              className="btn_accion_edit_ejercicio"
              /* variant="outlined" */
              colorScheme="blue"
              onClick={() => setBandEdit(true)}
            >
              Editar
            </Button>
          ) : (
            <Button
              className="btn_accion_edit_ejercicio"
              /* variant="contained" */
              color="info"
              onClick={() => setBandEdit(false)}
            >
              Cancelar
            </Button>
          )}
        
        {bandUpdated ? (
          <Button
            className="btn_accion_edit_ejercicio"
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
            "Esta seguro de actualizar los datos del ejercicio " +
            /*  ejercicio?.nombre?.toUpperCase() +
            ", " +
            ejercicio?.apellido?.toUpperCase() + */
            " ?"
          }
          handleSi={() => handleUpdate(ejercicio)}
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
  