import React, { useEffect } from 'react'

import {CloseOutlined} from '@ant-design/icons';
import { RecetaSee } from './RecetaSee';

export const VentEmergenteRecetaSee = ({isOpen,onClose,recetaSelected}) => {
    if (!isOpen) {
        return null;
      }

    

  return (
    <div className="popup-container">
      <div className="popup-content">
        <div className="header_vent_emergente">
        <h2 className={`popup-title`} >Receta</h2> 
        <CloseOutlined  className='icon_accion icons' onClick={onClose} />
        </div>

        <RecetaSee receta={recetaSelected} />
        
        {/* <button className={`popup-close-btn`} onClick={onClose}>Aceptar</button> */}
      </div>
    </div>
  )
}
