import React, { useEffect } from "react";
import { EditEjercicio } from "./EditEjercicio";

import { CloseOutlined } from "@ant-design/icons";
import { Row, Col } from "antd";

export const VentEmergenteEditEjercicio = ({
  isOpen,
  onClose,
  ejercicioSelected,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="popup-container"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
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

        <EditEjercicio onCloseEdit={onClose} ejercicio={ejercicioSelected} />
      </div>
    </div>
  );
};
