import React, { useEffect } from "react";

import { CloseOutlined } from "@ant-design/icons";
import { RecetaSee } from "./RecetaSee";
import { Row, Col } from "antd";

export const VentEmergenteRecetaSee = ({ isOpen, onClose, recetaSelected }) => {
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

        <RecetaSee receta={recetaSelected} />

      </div>
    </div>
  );
};
