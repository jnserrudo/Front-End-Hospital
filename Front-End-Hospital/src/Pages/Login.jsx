import React, { useContext, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { getAllUsuarios } from "../services/usuario-services.js";
import UsuarioContext from "../Contexts/UsuarioContext.jsx";

export const Login = () => {
  const navigate = useNavigate();

  const [bandAuth, setBandAuth] = useState(false);
  const [bandAuthProccess, setBandAuthProccess] = useState(false);

  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");

  const {  setNomUsuario, setRolUsuario } =
    useContext(UsuarioContext);

  useEffect(() => {
    setBandAuth(false);
    setBandAuthProccess(false);
  }, [nombre, password]);

  const handleLogin = async () => {
    const usuarios = await getAllUsuarios();
    console.log("usuarios", usuarios);
    if (usuarios) {
      let matchUsuario = usuarios?.findIndex((u) => u.nombre == nombre);
      if (matchUsuario >= 0) {
        //encontro a un usuario, veamos si esta bien su contraseña
        if (usuarios[matchUsuario].password == password) {
          setBandAuth(true);
          setBandAuthProccess(true);
          console.log(
            "usuario y contraseña validos",
            matchUsuario,
            usuarios[matchUsuario],
            nombre,
            password
          );
          setNomUsuario(usuarios[matchUsuario].nombre)
          setRolUsuario(usuarios[matchUsuario].idRol)
          navigate("/hospital");
        } else {
          setBandAuth(false);
          setBandAuthProccess(true);
        }
      } else {
        setBandAuth(false);
        setBandAuthProccess(true);
      }
    } else {
      //no se trajo usuarios problema back
    }
  };

  return (
    <div className="cont_login">
      <TextField
        className="input_login"
        label="Usuario"
        variant="filled"
        onChange={(e) => setNombre(e.target.value)}
      />
      <TextField
        className="input_login"
        label="Contraseña"
        variant="filled"
        onChange={(e) => setPassword(e.target.value)}
        type="password"
      />
      <Button variant="contained" className="btn_login" onClick={handleLogin}>
        Ingresar
      </Button>
      {!bandAuth && bandAuthProccess ? (
        <p>Usuario o Contraseña invalidos</p>
      ) : null}
      {/*       <p>¿Olvidaste la contraseña?</p>
       */}{" "}
    </div>
  );
};
