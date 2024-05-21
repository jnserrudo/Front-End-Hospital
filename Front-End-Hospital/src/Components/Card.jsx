import React from 'react'

export const Card = ({ onClick: setIndex,mje,logo}) => {
  return (
    <div onClick={setIndex} className='card' >
        {logo} 
        {mje}
    </div>
  )
}
