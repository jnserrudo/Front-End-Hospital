import React, { useEffect } from "react";
import { EditInformacion } from "./EditInformacion";
import { Button, ButtonGroup } from '@chakra-ui/react'

import { CloseOutlined } from "@ant-design/icons";
import { AddInformacion } from "./AddInformacion";
import { Row, Col } from "antd";

export const VentEmergenteAddInformacion = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="popup-container" onClick={(e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    }}>
      <div className="popup-content">
      <Row
          justify="space-between"
          align="middle"
          className="header_vent_emergente"
        >
          <Col>
            <CloseOutlined className="icon_accion icons" onClick={onClose} />
          </Col>
        </Row>

        <AddInformacion onClosePadre={onClose} />

       {/*  <Button className={`popup-close-btn`} onClick={onClose} colorScheme='blue' >
          Aceptar
        </Button> */}
      </div>
    </div>
  );
};
