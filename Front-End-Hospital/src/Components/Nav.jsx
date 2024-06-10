import React, { useContext } from "react";
import Button from "@mui/material/Button";
import { UserOutlined } from "@ant-design/icons";
import UsuarioContext from "../Contexts/UsuarioContext";

export const Nav = ({ bandHospital, bandLogin, setBandLogin = false }) => {
  //bandHospital nos sirve para saber si estamos en el login o no, si es true estamos en MainApp
  const {nomUsuario}=useContext(UsuarioContext)

  return (
    <div className="cont_btn_login">

      {!bandLogin && !bandHospital ? (
        <Button
          className="btn_login txt"
          variant="contained"
          color="success"
          onClick={() => setBandLogin(true)}
        >
          Iniciar Sesión
        </Button>
      ) : null}

{!bandLogin && bandHospital ?(
    <div className="cont_usuario">
        <UserOutlined style={{ fontSize: "50px" }} />
        <p  className="" >{ nomUsuario/* Nombre de Usuario */}</p>
      </div>
):null}
      
    </div>
  );
};
