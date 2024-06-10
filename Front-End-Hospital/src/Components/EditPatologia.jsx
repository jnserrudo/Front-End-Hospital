import { Button, TextField } from "@mui/material";
import { Space } from "antd";
import React, { useContext, useEffect, useState } from "react";
import "../style.css";
import PatologiasContext from "../Contexts/PatologiaContext";
import { useNavigate } from "react-router-dom";
export const EditPatologia = ({ patologia,onCloseEdit }) => {
  console.log("edit patologia: ", patologia);

  const navigate = useNavigate();
  const handleShowConsulta = (ndocu) => {
    navigate("/patologia/" + ndocu);
  };

  const [bandEdit, setBandEdit] = useState(false);
  const [bandUpdated, setBandUpdated] = useState(false);
  const [showVentEmergenteConfirmacion, setShowVentEmergenteConfirmacion] =
    useState(false);

  const [showVentEmergenteVacunas, setShowVentEmergenteVacunas] =
    useState(false);
  const [showVentEmergenteAFP, setShowVentEmergenteAFP] = useState(false);
  const [showVentEmergenteAPP, setShowVentEmergenteAPP] = useState(false);
  const [showVentEmergenteAlergias, setShowVentEmergenteAlergias] =
    useState(false);

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
  const handleCloseVentEmergente = () => {
    setShowVentEmergenteConfirmacion(false);
  };

  const { handleChangeInput,handleUpdate } = useContext(PatologiasContext);
  if (!patologia) {
    return null;
  }

  console.log("viendo al patologia: ",patologia)
  useEffect(() => {
    setBandUpdated(bandEdit);
  }, [bandEdit]);

  return (
    <div className="form_edit_patologia">
      {/* <h2>
        {patologia.nombre} {patologia.apellido}{" "}
      </h2>
 */}
      <div className="cont_input_edit">
        <TextField
          className={`input_edit ${!bandEdit ? "input_disabled" : ""}`}
          label="Nombre"
          name="nombre"
          variant="outlined"
          type="text"
          disabled={!bandEdit}
          value={patologia.nombre ? patologia.nombre : ""}
          onChange={(e) => handleChangeInput(e)}
        />
        <TextField
          className={`input_edit ${!bandEdit ? "input_disabled" : ""}`}
          label="Apellido"
          name="apellido"
          variant="outlined"
          type="text"
          disabled={!bandEdit}
          value={patologia.apellido ? patologia.apellido : ""}
          onChange={(e) => handleChangeInput(e)}
        />
      </div>
      <div className="cont_input_edit">
        <TextField
          className={`input_edit ${!bandEdit ? "input_disabled" : ""}`}
          label="DNI"
          name="dni"
          variant="outlined"
          type="number"
          disabled={!bandEdit}
          value={ patologia?.dni ? +patologia?.dni : 0 }
          onChange={(e) => handleChangeInput(e)}
        />
        <TextField
          className={`input_edit ${!bandEdit ? "input_disabled" : ""}`}
          label="Obra Social"
          name="obraSocial"
          variant="outlined"
          type="text"
          disabled={!bandEdit}
          value={patologia?.obraSocial ? patologia?.obraSocial : ""}
          onChange={(e) => handleChangeInput(e)}
        />
      </div>
      <div>
        <TextField
          className={`input_edit ${!bandEdit ? "input_disabled" : ""}`}
          label="Plan"
          name="plan"
          variant="outlined"
          type="text"
          disabled={!bandEdit}
          value={patologia.plan ? patologia.plan : ""}
          onChange={(e) => handleChangeInput(e)}
        />
        <TextField
          className={`input_edit ${!bandEdit ? "input_disabled" : ""}`}
          label="Domicilio"
          name="domicilio"
          variant="outlined"
          type="text"
          disabled={!bandEdit}
          value={patologia.domicilio ? patologia.domicilio : ""}
          onChange={(e) => handleChangeInput(e)}
        />
      </div>
      <div className="cont_input_edit">
        <TextField
          className={`input_edit ${!bandEdit ? "input_disabled" : ""}`}
          label="N° Afiliado"
          name="nroAfiliado"
          variant="outlined"
          type="text"
          disabled={!bandEdit}
          value={patologia.nroAfiliado ? +patologia.nroAfiliado : 0}
          onChange={(e) => handleChangeInput(e)}
        />
        <TextField
          className={`input_edit ${!bandEdit ? "input_disabled" : ""}`}
          label="Celular"
          name="celular"
          variant="outlined"
          type="number"
          disabled={!bandEdit}
          value={patologia.celular ? patologia.celular : ""}
          onChange={(e) => handleChangeInput(e)}
        />
      </div>
      <div className="cont_input_edit">
        <Button
          variant="contained"
          color="secondary"
          size="large"
          className="input_edit"
          onClick={() => setShowVentEmergenteVacunas(true)}
        >
          Vacunas
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          className="input_edit"
          onClick={() => setShowVentEmergenteAFP(true)}
        >
          AFP
        </Button>
      </div>
      <div className="cont_input_edit">
        <Button
          variant="contained"
          color="secondary"
          size="large"
          className="input_edit"
          onClick={() => setShowVentEmergenteAPP(true)}
        >
          APP
        </Button>
        <Button
          className="input_edit"
          variant="contained"
          color="secondary"
          size="large"
          onClick={() => setShowVentEmergenteAlergias(true)}
        >
          Alergias
        </Button>
      </div>
      <div className="cont_btns_acciones_patologia">
        <Button
          className="btn_accion_edit_patologia"
          variant="contained"
          onClick={() => handleShowConsulta(patologia.dni)}
        >
          Consultas
        </Button>

        {!bandEdit ? (
          <Button
            className="btn_accion_edit_patologia"
            variant="outlined"
            onClick={() => setBandEdit(true)}
          >
            Editar
          </Button>
        ) : (
          <Button
            className="btn_accion_edit_patologia"
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
          className="btn_accion_edit_patologia"
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
