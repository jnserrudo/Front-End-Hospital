import React, { useEffect } from "react";
import { EditReceta } from "./EditReceta";

import { CloseOutlined } from "@ant-design/icons";
import { Row, Col } from "antd";

export const VentEmergenteEditReceta = ({
  isOpen,
  onClose,
  recetaSelected,
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
      {" "}
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
        <EditReceta onCloseEdit={onClose} receta={recetaSelected} />
        {/*         <button className={`popup-close-btn`} onClick={onClose}>Aceptar</button>
         */}{" "}
      </div>
    </div>
  );
};
