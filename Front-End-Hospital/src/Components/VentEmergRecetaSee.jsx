import React, { useEffect } from 'react'

import {CloseOutlined} from '@ant-design/icons';
import { RecetaSee } from './RecetaSee';

export const VentEmergenteRecetaSee = ({isOpen,onClose,recetaSelected}) => {
    if (!isOpen) {
        return null;
      }

    

  return (
<div className="popup-container" onClick={(e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    }}>      <div className="popup-content medium_see_receta">
        <div className="header_vent_emergente">
{/*         <h2 className={`popup-title`} > {recetaSelected.nombre} </h2> 
 */}        <CloseOutlined  className='icon_accion icons' onClick={onClose} />
        </div>

        <RecetaSee receta={recetaSelected} />
        
        {/* <button className={`popup-close-btn`} onClick={onClose}>Aceptar</button> */}
      </div>
    </div>
  )
}
