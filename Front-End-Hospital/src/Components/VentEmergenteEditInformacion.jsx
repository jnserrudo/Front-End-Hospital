import React, { useEffect } from 'react'
import { EditInformacion } from './EditInformacion';

import {CloseOutlined} from '@ant-design/icons';

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
      <div className="popup-content small">
        <div className="header_vent_emergente">
{/*         <h2 className={`popup-title`} >Informacion</h2> 
 */}        <CloseOutlined  className='icon_accion icons' onClick={onClose} />
        </div>
        
        <EditInformacion onCloseEdit={onClose} informacion={informacionSelected} />
{/*         <button className={`popup-close-btn`} onClick={onClose}>Aceptar</button>
 */}      </div>
    </div>
  )
}
