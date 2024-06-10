import React, { useEffect } from 'react'
import { EditPatologia } from './EditPatologia';

import {CloseOutlined} from '@ant-design/icons';

export const VentEmergenteEditPatologia = ({isOpen,onClose,patologiaSelected}) => {
    if (!isOpen) {
        return null;
      }

    

  return (
    <div className="popup-container">
      <div className="popup-content">
        <div className="header_vent_emergente">
        <h2 className={`popup-title`} >Patologia</h2> 
        <CloseOutlined  className='icon_accion icons' onClick={onClose} />
        </div>
        
        <EditPatologia onCloseEdit={onClose} patologia={patologiaSelected} />
        <button className={`popup-close-btn`} onClick={onClose}>Aceptar</button>
      </div>
    </div>
  )
}
