import React, { useContext, useEffect, useState } from "react";
/* import Button from "@mui/material/Button"; */
import { UserOutlined } from "@ant-design/icons";
import UsuarioContext from "../Contexts/UsuarioContext";
import { useNavigate } from "react-router-dom";
import { Button, ButtonSpinner } from "@chakra-ui/react";
import { Button as ButtonAntd } from "antd";

export const Nav = ({ bandHospital, bandLogin, setBandLogin = false }) => {
  //bandHospital nos sirve para saber si estamos en el login o no, si es true estamos en MainApp
  //const {nomUsuario}=useContext(UsuarioContext)
  const navigate = useNavigate();

  const [nomUsuario, setNomUsuario] = useState("");
  useEffect(() => {
    setNomUsuario(localStorage.getItem("usuario"));
  }, [nomUsuario]);
  return (
    <div className="cont_btn_login">
      {/* {!bandLogin && 
      !bandHospital ? (
        <ButtonAntd
          className="btn_login txt"
          type="primary"
          onClick={() => setBandLogin(true)}
        >
          Iniciar Sesión
        </ButtonAntd>
      ) : null} */}

      {/* !bandLogin &&  */
      bandHospital ? (
        <div className="cont_usuario">
          <UserOutlined style={{ fontSize: "50px" }} />
          <p style={{ margin: "0 1rem" }} className="">
            {nomUsuario /* Nombre de Usuario */}
          </p>

          <Button
            className="btn_login txt"
            colorScheme="blue"
            onClick={() => navigate("/")}
          >
            Cerrar Sesión
          </Button>
        </div>
      ) : null}
    </div>
  );
};
