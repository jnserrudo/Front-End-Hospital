import React, { useEffect } from "react";
import { EditPatologia } from "./EditPatologia";
import { Button, ButtonGroup } from "@chakra-ui/react";

import { CloseOutlined } from "@ant-design/icons";
import { AddPatologia } from "./AddPatologia";
import { Row, Col } from "antd";

export const VentEmergenteAddPatologia = ({ isOpen, onClose }) => {
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

        <AddPatologia onClosePadre={onClose} />
      </div>
    </div>
  );
};
