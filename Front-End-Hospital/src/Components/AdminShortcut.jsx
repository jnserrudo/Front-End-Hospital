import React from "react";
import { Button } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { isStaff } from "../services/session";

/** Botón «Administrar» de las secciones públicas: solo lo ve el equipo de salud. */
export const AdminShortcut = ({ adminKey, setSelectedKey }) => {
  if (!isStaff() || !setSelectedKey) return null;
  return (
    <Button type="primary" icon={<SettingOutlined />} onClick={() => setSelectedKey(adminKey)} className="admin-action-btn">
      <span className="btn-text">Administrar</span>
    </Button>
  );
};

export default AdminShortcut;
