import React from 'react'

export const Card = ({ onClick: setIndex, mje, desc, logo }) => {
  return (
    <div onClick={setIndex} className='card'>
      <div className='card-icon'>{logo}</div>
      <span className='card-text'>{mje}</span>
      {desc && <span className='card-desc'>{desc}</span>}
    </div>
  )
}
