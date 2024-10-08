import React, { useEffect } from 'react'
import { EditInformacion } from './EditInformacion';

import {CloseOutlined} from '@ant-design/icons';
import { Row, Col } from "antd";

export const VentEmergenteEditInformacion = ({isOpen,onClose,informacionSelected}) => {
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
        
        <EditInformacion onCloseEdit={onClose} informacion={informacionSelected} />
{/*         <button className={`popup-close-btn`} onClick={onClose}>Aceptar</button>
 */}      </div>
    </div>
  )
}
