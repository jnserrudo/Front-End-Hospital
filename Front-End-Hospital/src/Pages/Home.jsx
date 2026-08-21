import React, { useState } from 'react'
import { Header } from '../Components/Header'

import '../style.css'
import { Login } from './Login';
import "../ventanaEmergente.css";

export const Home = () => {

  const [bandLogin, setBandLogin] = useState(false)

  return (
    <div className="login-page">
      <Header/>
      <main className="main_home main_home--fullscreen">
        <img src="/fondo.jpg" className="img_fondo" alt="" onError={(e) => e.target.style.display = 'none'} />
        {/* {bandLogin?<Login/>:null}  */}
        <Login/>
      </main>
    </div>
  )
}
