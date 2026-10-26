import React from "react";
import { Modal, Button } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import { useIdleLogout } from "../hooks/useIdleLogout";

const fmt = (ms) => {
  const total = Math.ceil(ms / 1000);
  const m = Math.floor(total / 60);
  const s = String(total % 60).padStart(2, "0");
  return `${m}:${s}`;
};

/** Aviso de inactividad: aparece 2 minutos antes de cerrar la sesión. */
export const SessionManager = () => {
  const { warning, remainingMs, keepAlive, logout } = useIdleLogout({ enabled: true });

  return (
    <Modal
      open={warning}
      centered
      closable={false}
      maskClosable={false}
      keyboard={false}
      width={440}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <ClockCircleOutlined style={{ color: "var(--warning, #f59e0b)", fontSize: 20 }} />
          <span>¿Seguís ahí?</span>
        </div>
      }
      footer={[
        <Button key="salir" onClick={() => logout("logout")}>
          Cerrar sesión
        </Button>,
        <Button key="seguir" type="primary" onClick={keepAlive}>
          Seguir conectado
        </Button>,
      ]}
    >
      <p style={{ margin: "8px 0 4px", lineHeight: 1.5 }}>
        No detectamos actividad en los últimos minutos. Por seguridad vamos a cerrar tu sesión en{" "}
        <strong style={{ fontVariantNumeric: "tabular-nums" }}>{fmt(remainingMs)}</strong>.
      </p>
      <p style={{ margin: 0, color: "var(--gray-500)", fontSize: 13 }}>
        Tocá «Seguir conectado» para continuar donde estabas. Si se cierra, lo que no hayas guardado se pierde.
      </p>
    </Modal>
  );
};
