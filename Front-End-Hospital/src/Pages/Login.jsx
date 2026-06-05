import React, { useContext, useEffect, useState } from "react";
import { Button, Input, Form, Alert } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  getJwtToken,
  getRolByUser,
  updatePassword,
} from "../services/usuario-services.js";
import UsuarioContext from "../Contexts/UsuarioContext.jsx";
import toast from "react-hot-toast";

export const Login = () => {
  const navigate = useNavigate();

  const [bandAuth, setBandAuth] = useState(false);
  const [bandAuthProccess, setBandAuthProccess] = useState(false);

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  const [nuevoPassword, setNuevoPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [bandBlanqueado, setBandBlanqueado] = useState(false);

  const { dniUsuario, setRolUsuario } = useContext(UsuarioContext);

  const [idUsuario, setIdUsuario] = useState(0);

  useEffect(() => {
    toast.dismiss();
  }, []);

  useEffect(() => {
    setBandAuth(false);
    setBandAuthProccess(false);
  }, [usuario, password]);

  const handleLogin = async () => {
    console.log(usuario);
    setError("");
    setLoading(true);

    try {
      const { token, dni, id, blanqueado } = await getJwtToken(usuario, password);
      //el jwt tambien me devuelve el dni para conseguir traer las patologias de ese dni en el caso que sea paciente

      console.log(token, dni, id, blanqueado);

      if (token && !token?.error) {
        setIdUsuario(id);
        localStorage.setItem("idUsuario", id);
        localStorage.setItem("token", token);
        setBandAuth(true);
        let rol = await getRolByUser(usuario);
        localStorage.setItem("usuario", usuario);
        localStorage.setItem("rol", rol);
        localStorage.setItem("dni", dni);

        if (blanqueado === 0) {
          setBandBlanqueado(true);
          toast('Usuario blanqueado, debe cambiar la contraseña!');
        } else {
          /*  toast.success('Logeado con exito!',{
            duration: 6000,
          }) */
          navigate("/hospital");
        }
      } else {
        setBandAuth(false);
        setError("Usuario o Contraseña invalidos");
      }
      setBandAuthProccess(true);
    } catch (err) {
      console.error(err);
      setError("Error de conexión al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (nuevoPassword !== confirmarPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const success = await updatePassword(idUsuario, nuevoPassword);
      console.log("resultado de updatepassword: ", success);
      if (success) {
        setBandBlanqueado(false);
        setNuevoPassword("");
        setConfirmarPassword("");
        setError("");
        setBandAuth(false);
        setBandAuthProccess(false);
        toast.success('Se actualizó la Contraseña!');
      } else {
        setError("Error al actualizar la contraseña");
      }
    } catch (err) {
      console.error(err);
      setError("Error al cambiar la contraseña");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (bandBlanqueado) {
        handleChangePassword();
      } else {
        handleLogin();
      }
    }
  };

  return (
    <div className="cont_login">


      <div className="login-header">
        <img
          src="/logoOñativia.png"
          alt="Logo"
          style={{ width: 72, height: 72, objectFit: "contain", marginBottom: 8 }}
          onError={(e) => e.target.style.display = 'none'}
        />
        <h2 className="login-title">Bienvenido</h2>
        <p className="login-subtitle">
          {bandBlanqueado ? "Cambiá tu contraseña para continuar" : "Ingresá a tu cuenta"}
        </p>
      </div>

      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          style={{ borderRadius: "var(--radius)", marginBottom: 8 }}
        />
      )}

      {bandBlanqueado ? (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Input.Password
              prefix={<LockOutlined style={{ color: "var(--gray-400)" }} />}
              placeholder="Nueva contraseña"
              value={nuevoPassword}
              onChange={(e) => setNuevoPassword(e.target.value)}
              onPressEnter={handleChangePassword}
              size="large"
              style={{ borderRadius: "var(--radius)" }}
            />
            <Input.Password
              prefix={<LockOutlined style={{ color: "var(--gray-400)" }} />}
              placeholder="Confirmar contraseña"
              value={confirmarPassword}
              onChange={(e) => setConfirmarPassword(e.target.value)}
              onPressEnter={handleChangePassword}
              size="large"
              style={{ borderRadius: "var(--radius)" }}
            />
          </div>
          <Button
            type="primary"
            size="large"
            block
            loading={loading}
            onClick={handleChangePassword}
            style={{ borderRadius: "var(--radius)", fontWeight: 600, height: 46, marginTop: 8 }}
          >
            Cambiar Contraseña
          </Button>
        </>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Input
              prefix={<UserOutlined style={{ color: "var(--gray-400)" }} />}
              placeholder="Usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              onPressEnter={handleLogin}
              size="large"
              style={{ borderRadius: "var(--radius)" }}
            />
            <Input.Password
              prefix={<LockOutlined style={{ color: "var(--gray-400)" }} />}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onPressEnter={handleLogin}
              size="large"
              style={{ borderRadius: "var(--radius)" }}
            />
          </div>
          <Button
            type="primary"
            size="large"
            block
            icon={<LoginOutlined />}
            loading={loading}
            onClick={handleLogin}
            style={{ borderRadius: "var(--radius)", fontWeight: 600, height: 46, marginTop: 8 }}
          >
            Ingresar
          </Button>
        </>
      )}
    </div>
  );
};
