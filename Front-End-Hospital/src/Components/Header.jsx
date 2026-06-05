import React, { useEffect, useState } from "react";
import "../style.css";
import { EnvironmentOutlined, PhoneOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ROLES = {
  1: "Administrador",
  2: "Profesional",
  3: "Paciente"
};

export const Header = ({ setSelectedKey }) => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState("");
  const [rol, setRol] = useState("");

  useEffect(() => {
    const usuarioFromStorage = localStorage.getItem("usuario");
    const rolFromStorage = localStorage.getItem("rol");
    setUsuario(usuarioFromStorage || "");
    setRol(rolFromStorage ? ROLES[rolFromStorage] || "Usuario" : "");
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    toast.dismiss();
    navigate("/");
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  const menuItems = [
    {
      key: 'user-info',
      label: (
        <div style={{ padding: '4px 0' }}>
          <div style={{ fontWeight: 600, fontSize: '14px' }}>{usuario || "Usuario"}</div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>{rol}</div>
        </div>
      ),
      disabled: true
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Cerrar Sesión',
      onClick: handleLogout
    }
  ];

  return (
    <div className="header">
      <div className="header-brand">
        <img
          className="logo_hospital"
          onClick={() => setSelectedKey("1")}
          src="/logoOñativia.png"
          alt="Logo Hospital Oñativia"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.style.display = 'flex';
            e.target.parentElement.innerHTML = '<span class="logo-placeholder">HOSPITAL OÑATIVIA</span>';
          }}
        />
        <p className="titulo">HOSPITAL OÑATIVIA</p>
      </div>
      <div className="header-info">
        <span className="header-info-item">
          <EnvironmentOutlined />
          Paz Chaín 30 · Salta
        </span>
        <span className="header-info-item">
          <PhoneOutlined style={{ transform: "rotate(90deg)" }} />
          0387 422-1605
        </span>
      </div>
      {usuario && (
        <Dropdown
          menu={{ items: menuItems }}
          placement="bottomRight"
          trigger={['click']}
        >
          <div className="user-dropdown-trigger">
            <div className="user-avatar">
              {getInitial(usuario)}
            </div>
          </div>
        </Dropdown>
      )}
    </div>
  );
};
