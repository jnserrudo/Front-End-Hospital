import React from 'react'
import TextField from '@mui/material/TextField';
import { Button } from "antd";
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const navigate=useNavigate()
  return (
    <div className='cont_login' >
      
      <TextField className='input_login' label="Usuario" variant="filled" />
      <TextField className='input_login' label="Contraseña" variant="filled" />
      <Button variant="contained" className='btn_login' onClick={()=>navigate('/hospital')} >  
           Ingresar
      </Button>
      <p>¿Olvidaste la contraseña?</p>
    </div>
  )
}
