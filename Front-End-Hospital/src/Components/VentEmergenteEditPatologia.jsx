import React, { useEffect } from "react";
import { EditPatologia } from "./EditPatologia";

import { CloseOutlined } from "@ant-design/icons";
import { Row, Col } from "antd";

export const VentEmergenteEditPatologia = ({
  isOpen,
  onClose,
  patologiaSelected,
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
        <EditPatologia onCloseEdit={onClose} patologia={patologiaSelected} />
        
      </div>
    </div>
  );
};
