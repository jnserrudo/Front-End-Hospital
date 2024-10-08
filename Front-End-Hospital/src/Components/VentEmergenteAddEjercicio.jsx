import React, { useEffect } from "react";
import { EditEjercicio } from "./EditEjercicio";

import { CloseOutlined } from "@ant-design/icons";
import { AddEjercicio } from "./AddEjercicio";
import { Row, Col } from "antd";

export const VentEmergenteAddEjercicio = ({ isOpen, onClose }) => {
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
      <div className="popup-content ">
        <Row
          justify="space-between"
          align="middle"
          className="header_vent_emergente"
        >
          <Col>
            <CloseOutlined className="icon_accion icons" onClick={onClose} />
          </Col>
        </Row>
        <AddEjercicio />
        {/*         <button className={`popup-close-btn`} onClick={onClose}>Aceptar</button>
         */}{" "}
      </div>
    </div>
  );
};
