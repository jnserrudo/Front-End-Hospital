
import React, { useEffect } from 'react'
import { EditEjercicio } from './EditEjercicio';

import {CloseOutlined} from '@ant-design/icons';
import { AddEjercicio } from './AddEjercicio';

export const VentEmergenteAddEjercicio = ({isOpen,onClose}) => {
    if (!isOpen) {
        return null;
      }

    

  return (
    <div className="popup-container">
      <div className="popup-content medium">
        <div className="header_vent_emergente">
        <h2 className={`popup-title`} >Ejercicio</h2> 
        <CloseOutlined  className='icon_accion icons' onClick={onClose} />
        </div>
        
        <AddEjercicio />
{/*         <button className={`popup-close-btn`} onClick={onClose}>Aceptar</button>
 */}      </div>
    </div>
  )
}
