
import React, { useEffect } from 'react'
import { EditPaciente } from './EditPaciente';

import {CloseOutlined} from '@ant-design/icons';
import { AddPaciente } from './AddPaciente';

export const VentEmergenteAddPaciente = ({isOpen,onClose}) => {
    if (!isOpen) {
        return null;
      }

    

  return (
    <div className="popup-container">
      <div className="popup-content">
        <div className="header_vent_emergente">
        <h2 className={`popup-title`} >Paciente</h2> 
        <CloseOutlined  className='icon_accion icons' onClick={onClose} />
        </div>
        
        <AddPaciente />
        <button className={`popup-close-btn`} onClick={onClose}>Aceptar</button>
      </div>
    </div>
  )
}
