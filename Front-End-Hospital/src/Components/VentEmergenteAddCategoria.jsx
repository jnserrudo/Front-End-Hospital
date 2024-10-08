import React, { useEffect } from "react";
import { EditCategoria } from "./EditCategoria";
import { Button, ButtonGroup } from "@chakra-ui/react";

import { CloseOutlined } from "@ant-design/icons";
import { AddCategoria } from "./AddCategoria";
import { Row, Col } from "antd";

export const VentEmergenteAddCategoria = ({ isOpen, onClose }) => {
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
        <AddCategoria onClosePadre={onClose} />

      </div>
    </div>
  );
};
