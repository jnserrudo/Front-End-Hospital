import {
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Textarea,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import "../style.css";
import { Select, Space, Tooltip, Upload } from "antd";
import ImgCrop from "antd-img-crop";

import PacientesContext from "../Contexts/PacienteContext";
import { useNavigate } from "react-router-dom";
import { Input } from "@chakra-ui/react";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import toast, { Toaster } from "react-hot-toast";
import {
  DeshabilitarPaciente,
  HabilitarPaciente,
} from "../services/paciente-services";
import { VentEmergenteHabilitamiento } from "./VentEmergenteHabilitamiento";

export const EditPaciente = ({ paciente, onCloseEdit }) => {
  console.log("edit paciente: ", paciente);

  const [bandEdit, setBandEdit] = useState(false);
  const [bandUpdated, setBandUpdated] = useState(false);
  const [showVentEmergenteConfirmacion, setShowVentEmergenteConfirmacion] =
    useState(false);

  const [showVentEmergenteHabilitamiento, setShowVentEmergenteHabilitamiento] =
    useState(false);

  const { handleChangeInput, handleUpdate } = useContext(PacientesContext);
  if (!paciente) {
    return null;
  }

  const handleCloseVentEmergente = async () => {
    setShowVentEmergenteConfirmacion(false);
  };

  const handleCloseVentEmergenteHabilitamiento = async () => {
    setShowVentEmergenteHabilitamiento(false);
  };

  const handleHabilitar = async (pacienteId, usuarioId, motivo) => {
    toast.promise(HabilitarPaciente(pacienteId, usuarioId, motivo), {
      loading: "Cargando",
      success: <b>Se habilito al paciente!</b>,
      error: <b>No se pudo habilitar al paciente.</b>,
    });
    handleCloseVentEmergente();
  };

  const handleDeshabilitar = async (pacienteId, usuarioId, motivo) => {
    toast.promise(DeshabilitarPaciente(pacienteId, usuarioId, motivo), {
      loading: "Cargando",
      success: <b>Se deshabilito al paciente!</b>,
      error: <b>No se pudo deshabilitar al paciente.</b>,
    });
    handleCloseVentEmergente();
  };

  console.log("viendo al paciente: ", paciente);
  useEffect(() => {
    setBandUpdated(bandEdit);

    console.log("band edit y paciente : ", bandEdit, paciente);
  }, [bandEdit]);

  return (
    <div className="form_edit_receta">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="cont_form_input">
        <FormControl
          className="cont_input_edit_large"
          variant="floating"
          id="nombre"
          isRequired
        >
          <Input
            className={`input_edit_large ${!bandEdit ? "input_disabled" : ""}`}
            label=""
            name="nombre"
            variant="outlined"
            type="text"
            disabled={!bandEdit}
            value={paciente?.usuario?.nombre ? paciente?.usuario?.nombre : ""}
            onChange={(e) => handleChangeInput(e)}
          />
          <FormLabel>Nombre</FormLabel>
        </FormControl>
        <FormControl
          className="cont_input_edit_large"
          variant="floating"
          id="apellido"
          isRequired
        >
          <Input
            className={`input_edit_large`}
            placeholder=""
            name="apellido"
            disabled={!bandEdit}
            variant="outlined"
            type="text"
            value={
              paciente?.usuario?.apellido ? paciente?.usuario?.apellido : ""
            }
            onChange={(e) => handleChangeInput(e)}
          />
          <FormLabel>Apellido</FormLabel>
        </FormControl>
      </div>
      <div className="cont_form_input">
        <FormControl
          className="cont_input_edit"
          variant="floating"
          id="dni"
          isRequired
        >
          <Input
            className={`input_edit ${!bandEdit ? "input_disabled" : ""}`}
            label=""
            name="nombre"
            variant="outlined"
            type="text"
            disabled={!bandEdit}
            value={paciente?.usuario?.dni ? paciente?.usuario?.dni : ""}
            onChange={(e) => handleChangeInput(e)}
          />
          <FormLabel>Documento de identidad</FormLabel>
        </FormControl>
      </div>

      <div className="cont_btns_pacientes">
        {paciente.habilitado == 1 ? (
          <Button
            className="btn_accion_edit_receta"
            colorScheme={"blue"}
            isDisabled={localStorage.getItem("rol") <3?false:true}
            onClick={() => setShowVentEmergenteHabilitamiento(true)}
          >
            Deshabilitar
          </Button>
        ) : (
          <Button
            className="btn_accion_edit_receta"
            colorScheme={"blue"}
            onClick={() => setShowVentEmergenteHabilitamiento(true)}
          >
            Habilitar
          </Button>
        )}

        <Button
          className="btn_accion_edit_receta"
          colorScheme={"blue"}
          isDisabled={true}
        >
          Ficha Salud
        </Button>

        <Button
          className="btn_accion_edit_receta"
          colorScheme={"blue"}
          isDisabled={true}
        >
          Consultas
        </Button>

        <Button
          className="btn_accion_edit_receta"
          colorScheme={"blue"}
          isDisabled={true}
        >
          Informes
        </Button>

        <Button
          className="btn_accion_edit_receta"
          colorScheme={"blue"}
          isDisabled={true}
        >
          Diarios
        </Button>
      </div>

      <VentEmergenteHabilitamiento
        onClosePadre={onCloseEdit}
        onClose={handleCloseVentEmergenteHabilitamiento}
        mje={`Esta seguro de ${
          paciente.habilitado == 1 ? "deshabilitar" : "habilitar"
        } al paciente? `}
        handleSi={
          paciente.habilitado == 1
            ? (motivo) => handleDeshabilitar(paciente.id,localStorage.getItem("idUsuario"),motivo)
            : (motivo) => handleHabilitar(paciente.id,localStorage.getItem("idUsuario"),motivo)
        }
        isOpen={showVentEmergenteHabilitamiento}
      />

      <VentEmergConfirmacion
        onClosePadre={onCloseEdit}
        onClose={handleCloseVentEmergente}
        mje={"Esta seguro de actualizar los datos del paciente " + " ?"}
        handleSi={() => handleUpdate(paciente)}
        /*  handleSi={handleUpdateWithImage} */
        isOpen={showVentEmergenteConfirmacion}
      />
    </div>
  );
};
