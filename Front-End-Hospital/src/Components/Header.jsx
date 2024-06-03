import React from 'react'
import '../style.css'
import {EnvironmentOutlined,PhoneOutlined} from '@ant-design/icons';
export const Header = () => {
  return (
    <div className='header' >
      
    <img  className='logo_hospital' src="/logoOñativia.png" alt="" />
      <p className='titulo txt' >HOSPITAL OÑATIVIA</p>
      
      <img src="" alt="" />
      
      <h3 className='txt' ><EnvironmentOutlined />   Paz Chaín 30 4400 Salta Salta · 03 km</h3>
      
      <h3 className='txt' > <PhoneOutlined /> 0387 422-1605</h3>
    </div>
  )
}
