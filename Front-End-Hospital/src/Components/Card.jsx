import React from 'react'

// Tarjeta de acceso del inicio. Es un botón: se puede usar con el dedo, el mouse o el teclado.
export const Card = ({ onClick: setIndex, mje, desc, logo }) => {
  return (
    <button type='button' onClick={setIndex} className='card'>
      <span className='card-icon'>{logo}</span>
      <span className='card-text'>{mje}</span>
      {desc && <span className='card-desc'>{desc}</span>}
    </button>
  )
}
