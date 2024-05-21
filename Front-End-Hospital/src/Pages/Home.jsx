import React, { useState } from 'react'
import { Header } from '../Components/Header'

import '../style.css'
import { Nav } from '../Components/Nav';
import { Login } from './Login';

export const Home = () => {

  const [bandLogin, setBandLogin] = useState(false)

  return (
    <div>
      
    <Header/>



    <Nav  bandLogin={bandLogin} setBandLogin={setBandLogin} bandHospital={false} />

      

      <main className='main_home'>
        <img src="../../public/fondo.jpg"  className='img_fondo' alt="" />
        {bandLogin?<Login/>:null}  
      </main>

      
      </div>
  )
}
