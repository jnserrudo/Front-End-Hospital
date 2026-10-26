import React, { useEffect, useState } from "react";
import "../style.css";
import { EnvironmentOutlined, PhoneOutlined, LogoutOutlined, MenuOutlined, IdcardOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
import { useNavigate } from "react-router-dom";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import { MisDatosModal } from "./MisDatosModal";
import { clearSession, getSession, ROL_LABEL } from "../services/session";

export const Header = ({ setSelectedKey, collapsed, setCollapsed, hideMenu = false }) => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState("");
  const [rol, setRol] = useState("");
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [misDatos, setMisDatos] = useState(false);
  const canToggleMenu = typeof setCollapsed === "function" && !hideMenu;

  useEffect(() => {
    const session = getSession();
    setUsuario(session?.usuario || "");
    setRol(session?.rol ? ROL_LABEL[session.rol] || "Usuario" : "");
  }, []);

  const handleLogout = async () => {
    clearSession();
    localStorage.setItem("sessionEvent", JSON.stringify({ type: "logout", motivo: "logout", at: Date.now() }));
    navigate("/login?motivo=logout", { replace: true });
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
      key: 'mis-datos',
      icon: <IdcardOutlined />,
      label: 'Mis datos y contraseña',
      onClick: () => setMisDatos(true)
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Cerrar sesión',
      onClick: () => setConfirmLogout(true)
    }
  ];

  return (
    <div className="header">
      <div className="header-brand">
        {canToggleMenu && (
          <div
            className="menu-toggle-btn"
            onClick={() => setCollapsed(!collapsed)}
            role="button"
            aria-label={collapsed ? "Abrir menú" : "Cerrar menú"}
          >
            <MenuOutlined style={{ fontSize: '20px', color: 'white' }} />
          </div>
        )}
        <img
          className="logo_hospital"
          onClick={() => setSelectedKey("1")}
          src="/logo-onativia.png"
          alt="Logo del Hospital Dr. Arturo Oñativia"
          onError={(e) => {
            // Solo ocultamos la imagen: el nombre del hospital ya se muestra al lado.
            e.currentTarget.style.display = "none";
          }}
        />
        <p className="titulo">Hospital Dr. Arturo Oñativia</p>
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
      <MisDatosModal open={misDatos} onClose={() => setMisDatos(false)} />
      <VentEmergConfirmacion
        isOpen={confirmLogout}
        onClose={() => setConfirmLogout(false)}
        title="¿Cerrar sesión?"
        mje={`Vas a salir de la cuenta «${usuario}». Si tenés un formulario abierto sin guardar, esos cambios se pierden. Para volver a entrar necesitás tu usuario y contraseña.`}
        confirmText="Cerrar sesión"
        handleSi={handleLogout}
      />
    </div>
  );
};
