import React, { useEffect } from "react";
import { EditPaciente } from "./EditPaciente";
import {
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Textarea,
} from "@chakra-ui/react";
import { CloseOutlined } from "@ant-design/icons";
import { useState } from "react";

export const VentEmergenteHabilitamiento = ({
  isOpen,
  onClose,
  mje,
  onClosePadre,
  handleSi,
  pacienteSelected,
}) => {
  if (!isOpen) {
    return null;
  }

  const [motivo, setMotivo] = useState("");

  return (
    <div
      className="popup-container"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="popup-content mini">
        <div className="header_vent_emergente">
          <CloseOutlined className="icon_accion icons" onClick={onClose} />
        </div>
        <p> {mje} </p>
        <div className="cont_habilitamiento">
          <FormControl
            className="cont_input_edit"
            variant="floating"
            id="detalle"
            isRequired
          >
            <Textarea
              className={`input_edit`}
              placeholder=""
              name="motivo"
              size="sm"
              variant="outlined"
              type="text"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
            />
            <FormLabel>Motivo</FormLabel>
          </FormControl>
          <div className="cont_btns_habilitamiento">
            <Button
              className="btn_accion_edit_receta"
              colorScheme={"blue"}
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              className="btn_accion_edit_receta"
              colorScheme={"blue"}
              isDisabled={motivo.length > 0 ? false : true}
              onClick={async () => {
                //aca definimos lo que pasara cuando se confirme la operacion
                //como asi tambien cerramos las ventanas emergente, de esta manera podemos reusar este componente en varios casos
                await handleSi(motivo);
                onClose();
                if (onClosePadre) {
                  onClosePadre();
                }
              }}
            >
              Confirmar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
