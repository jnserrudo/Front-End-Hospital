import React, { useEffect } from 'react'
import { EditEjercicio } from './EditEjercicio';

import {CloseOutlined} from '@ant-design/icons';

export const VentEmergenteEditEjercicio = ({isOpen,onClose,ejercicioSelected}) => {
    if (!isOpen) {
        return null;
      }

    

  return (
    <div className="popup-container"  onClick={(e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    }}
  > 
      <div className="popup-content small">
        <div className="header_vent_emergente">
{/*         <h2 className={`popup-title`} >Ejercicio</h2> 
 */}        <CloseOutlined  className='icon_accion icons' onClick={onClose} />
        </div>
        
        <EditEjercicio onCloseEdit={onClose} ejercicio={ejercicioSelected} />
{/*         <button className={`popup-close-btn`} onClick={onClose}>Aceptar</button>
 */}      </div>
    </div>
  )
}
