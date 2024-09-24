import React, { useEffect } from 'react'
import { EditCategoria } from './EditCategoria';

import {CloseOutlined} from '@ant-design/icons';

export const VentEmergenteEditCategoria = ({isOpen,onClose,categoriaSelected}) => {
    if (!isOpen) {
        return null;
      }


  return (
<div className="popup-container" onClick={(e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    }}>      <div className="popup-content small mini">
        <div className="header_vent_emergente">
        {/* <h2 className={`popup-title`} >Categoria</h2>  */}
        <CloseOutlined  className='icon_accion icons' onClick={onClose} />
        </div>
        
        <EditCategoria onCloseEdit={onClose} categoria={categoriaSelected} />
{/*         <button className={`popup-close-btn`} onClick={onClose}>Aceptar</button>
 */}      </div>
    </div>
  )
}
