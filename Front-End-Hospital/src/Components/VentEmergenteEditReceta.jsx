import React, { useEffect } from 'react'
import { EditReceta } from './EditReceta';

import {CloseOutlined} from '@ant-design/icons';

export const VentEmergenteEditReceta = ({isOpen,onClose,recetaSelected}) => {
    if (!isOpen) {
        return null;
      }

    

  return (
    <div className="popup-container">
      <div className="popup-content medium">
        <div className="header_vent_emergente">
        <h2 className={`popup-title`} >Receta</h2> 
        <CloseOutlined  className='icon_accion icons' onClick={onClose} />
        </div>
        
        <EditReceta onCloseEdit={onClose} receta={recetaSelected} />
{/*         <button className={`popup-close-btn`} onClick={onClose}>Aceptar</button>
 */}      </div>
    </div>
  )
}
