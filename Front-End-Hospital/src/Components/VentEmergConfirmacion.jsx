import React from "react";
import { CloseOutlined } from "@ant-design/icons";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { Space } from "antd";
import { useContext } from "react";
import { LoaderEmergente } from "./LoaderEmergente";
import PatologiasContext from "../Contexts/PatologiaContext";

export const VentEmergConfirmacion = ({
  onClosePadre = null,
  mje,
  isOpen,
  onClose,
  handleSi,
}) => {
  //const {bandLoader:bandLoaderConsulta} = useContext(ConsultaContext)
  const { bandLoader: bandLoaderPatologia } = useContext(PatologiasContext);

  if (!isOpen) {
    return null;
  }
  return (
    <div className="popup-container">
      <div className="popup-content x-small">
        <div className="header_vent_emergente">
          <CloseOutlined className="icon_accion icons" onClick={onClose} />
        </div>

        <p> {mje} </p>
        <div className="cont_btns_confirmacion" >
          <Button width={'80px'} colorScheme="blue" onClick={onClose}>
            No
          </Button>
          <Button
            colorScheme="green"
            width={'80px'}
            onClick={async () => {
              //aca definimos lo que pasara cuando se confirme la operacion
              //como asi tambien cerramos las ventanas emergente, de esta manera podemos reusar este componente en varios casos
              await handleSi();
              onClose();
              if (onClosePadre) {
                onClosePadre();
              }
            }}
          >
            Si
          </Button>
        </div>
        {bandLoaderPatologia /* || bandLoaderConsulta */ ? (
          <LoaderEmergente />
        ) : null}
      </div>
    </div>
  );
};
