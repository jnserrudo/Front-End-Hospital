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
  
  import InformacionsContext from "../Contexts/InformacionContext";
  import { useNavigate } from "react-router-dom";
  import { Input } from "@chakra-ui/react";
  
  export const EditInformacion = ({ informacion, onCloseEdit }) => {
    console.log("edit informacion: ", informacion);
  
    const navigate = useNavigate();
    const handleShowConsulta = (ndocu) => {
      navigate("/informacion/" + ndocu);
    };
  
    const [bandEdit, setBandEdit] = useState(false);
    const [bandUpdated, setBandUpdated] = useState(false);
    const [showVentEmergenteConfirmacion, setShowVentEmergenteConfirmacion] =
      useState(false);
  
    const { handleChangeInput, handleUpdate } = useContext(InformacionsContext);
    if (!informacion) {
      return null;
    }
  
    console.log("viendo al informacion: ", informacion);
    useEffect(() => {
      setBandUpdated(bandEdit);
    }, [bandEdit]);
  
    return (
      <div className="form_edit_informacion">
        {/* <h2>
          {informacion.nombre} {informacion.apellido}{" "}
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
              value={informacion.nombre ? informacion.nombre : ""}
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
              value={informacion.descripcion ? informacion.descripcion : ""}
              onChange={(e) => handleChangeInput(e)}
            />
            <FormLabel>Descripción</FormLabel>
          </FormControl>
        </div>
  
        <div className="cont_btns_acciones_informacion">
          {!bandEdit ? (
            <Button
              className="btn_accion_edit_informacion"
              /* variant="outlined" */
              colorScheme="blue"
              onClick={() => setBandEdit(true)}
            >
              Editar
            </Button>
          ) : (
            <Button
              className="btn_accion_edit_informacion"
              /* variant="contained" */
              color="info"
              onClick={() => setBandEdit(false)}
            >
              Cancelar
            </Button>
          )}
        
        {bandUpdated ? (
          <Button
            className="btn_accion_edit_informacion"
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
            "Esta seguro de actualizar los datos del informacion " +
            /*  informacion?.nombre?.toUpperCase() +
            ", " +
            informacion?.apellido?.toUpperCase() + */
            " ?"
          }
          handleSi={() => handleUpdate(informacion)}
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
  