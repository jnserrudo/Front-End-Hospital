import { Button, ButtonGroup } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import "../style.css";
import { Select, Space, Tooltip } from "antd";

import RecetasContext from "../Contexts/RecetaContext";
import { useNavigate } from "react-router-dom";
import { Input } from "@chakra-ui/react";
import { getPatologiaToRecetaEdit } from "../services/recetas-services";

export const EditReceta = ({ receta,onCloseEdit }) => {
  console.log("edit receta: ", receta);
  
  const navigate = useNavigate();
  const handleShowConsulta = (ndocu) => {
      navigate("/receta/" + ndocu);
      };

  const [bandEdit, setBandEdit] = useState(false);
  const [bandUpdated, setBandUpdated] = useState(false);
  const [showVentEmergenteConfirmacion, setShowVentEmergenteConfirmacion] =
  useState(false);
  const [patologiasAsociadas, setPatologiasAsociadas] = useState([]);
  const [patologiasNoAsociadas, setPatologiasNoAsociadas] = useState([]);
  const [selectedPatologias, setSelectedPatologias] = useState([]);


  const { handleChangeInput,handleUpdate,patologiasxRecetasEdit,handleChangeSelect } = useContext(RecetasContext);
  if (!receta) {
    return null;
  }


const opcionesPatologias = [
    ...patologiasAsociadas.map(p => ({ label: p.nombre, value: p.id, type: 'asociada' })),
    ...patologiasNoAsociadas.map(p => ({ label: p.nombre, value: p.id, type: 'no-asociada' })),
  ];

  const sharedProps = {
    mode: "multiple",
    style: { width: "100%" },
    options: opcionesPatologias,
    placeholder: "Seleccione una Patología",
    maxTagCount: "responsive",
    value: selectedPatologias,
    renderOptionLabel: (option) => (
      <div>
        {option.label} {option.type === 'asociada' ? '(Asociada)' : ''}
      </div>
    ),
  };

  
  useEffect(() => {
    if (patologiasxRecetasEdit && patologiasxRecetasEdit.length > 0) {
          setPatologiasAsociadas(patologiasxRecetasEdit.patologiasAsociadas);
          setPatologiasNoAsociadas(patologiasxRecetasEdit.patologiasNoAsociadas);
          setSelectedPatologias(patologiasxRecetasEdit.patologiasAsociadas.map(p => p.id));
        
    }
  }, [patologiasxRecetasEdit]); // Dependencia cambiada a patologiasxRecetasEdit
  

  console.log("viendo al receta: ",receta)
  useEffect(() => {
    setBandUpdated(bandEdit);
  }, [bandEdit]);

  return (
    <div className="form_edit_receta">
      {/* <h2>
        {receta.nombre} {receta.apellido}{" "}
      </h2>
 */}
      <div className="cont_input_edit">
        <Input
          className={`input_edit ${!bandEdit ? "input_disabled" : ""}`}
          label="Nombre"
          name="nombre"
          variant="outlined"
          type="text"
          disabled={!bandEdit}
          value={receta.nombre ? receta.nombre : ""}
          onChange={(e) => handleChangeInput(e)}
        />
        <Input
          className={`input_edit ${!bandEdit ? "input_disabled" : ""}`}
          label="Apellido"
          name="apellido"
          variant="outlined"
          type="text"
          disabled={!bandEdit}
          value={receta.apellido ? receta.apellido : ""}
          onChange={(e) => handleChangeInput(e)}
        />
      </div>
      <div className="cont_input_edit">
        <Input
          className={`input_edit`}
          placeholder="Calorias"
          name="calorias"
          variant="outlined"
          type="text"
          value={receta?.calorias ? receta.calorias : ""}
          onChange={(e) => handleChangeInput(e)}
        />
        <Input
          className={`input_edit`}
          placeholder="Tiempo"
          name="tiempo"
          variant="outlined"
          type="text"
          value={receta?.tiempo ? receta.tiempo : ""}
          onChange={(e) => handleChangeInput(e)}
        />
      </div>

      <div className="cont_input_edit">
        <Input
          className={`input_edit`}
          placeholder="URL Foto"
          name="urlFoto"
          variant="outlined"
          type="text"
          value={receta?.urlFoto ? receta.urlFoto : ""}
          onChange={(e) => handleChangeInput(e)}
        />
        <Input
          className={`input_edit`}
          placeholder="Ingredientes"
          name="ingredientes"
          variant="outlined"
          type="text"
          value={receta?.ingredientes ? receta.ingredientes : ""}
          onChange={(e) => handleChangeInput(e)}
        />
      </div>
      <div className="cont_input_edit">
        <Input
          className={`input_edit`}
          placeholder="Preparación"
          name="preparacion"
          variant="outlined"
          type="text"
          value={receta?.preparacion ? receta.preparacion : ""}
          onChange={(e) => handleChangeInput(e)}
        />
        {/* SELECT DE LAS PATOLOGIAS */}
        <Select
        className="select"
          {...sharedProps}
          /* value={alumnos} */
          onChange={handleChangeSelect}
        />
      </div>
      <div className="cont_btns_acciones_receta">

        {!bandEdit ? (
          <Button
            className="btn_accion_edit_receta"
            variant="outlined"
            onClick={() => setBandEdit(true)}
          >
            Editar
          </Button>
        ) : (
          <Button
            className="btn_accion_edit_receta"
            variant="contained"
            color="info"
            onClick={() => setBandEdit(false)}
          >
            Cancelar
          </Button>
        )}
      </div>

      {bandUpdated ? (
        <Button
          className="btn_accion_edit_receta"
          color="success"
          variant="contained"
          style={{ margin: "1rem auto 0" }}
          onClick={() => setShowVentEmergenteConfirmacion(true)}

        >
          Actualizar
        </Button>
      ) : null}

     

      <VentEmergConfirmacion
        onClosePadre={onCloseEdit}
        onClose={handleCloseVentEmergente}
        mje={
          "Esta seguro de actualizar los datos del receta " +
         /*  receta?.nombre?.toUpperCase() +
          ", " +
          receta?.apellido?.toUpperCase() + */
          " ?"
        }
        handleSi={() => handleUpdate(receta)}
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
