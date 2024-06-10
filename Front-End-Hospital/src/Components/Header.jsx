import React from 'react'
import '../style.css'
import {EnvironmentOutlined,PhoneOutlined} from '@ant-design/icons';
export const Header = () => {
  return (
    <div className='header' >
      
    <img  className='logo_hospital' src="/logoOñativia.png" alt="" />
      <p className='titulo' >HOSPITAL OÑATIVIA</p>
      
      <img src="" alt="" />
      
      <p className='txt' ><EnvironmentOutlined />   Paz Chaín 30 4400 Salta Salta · 03 km</p>
      
      <h3 className='txt' > <PhoneOutlined /> 0387 422-1605</h3>
    </div>
  )
}
