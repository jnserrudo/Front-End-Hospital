import React, { useEffect } from "react";
import { EditUsuario } from "./EditUsuario";

import { CloseOutlined } from "@ant-design/icons";
import { AddUsuario } from "./AddUsuario";
import { Row, Col } from "antd";

export const VentEmergenteAddUsuario = ({ isOpen, onClose }) => {
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
        <AddUsuario />
      </div>
    </div>
  );
};
