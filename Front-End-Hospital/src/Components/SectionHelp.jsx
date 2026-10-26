import React from "react";
import { Alert } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

/**
 * Ayuda estándar de cada sección: «¿Cómo usar esta sección?» con qué es, para qué
 * sirve y cómo se usa. Siempre igual en todas las pantallas (se puede cerrar).
 */
export const SectionHelp = ({ children, title = "¿Cómo usar esta sección?", className, style }) => (
  <Alert
    message={title}
    description={children}
    type="info"
    icon={<InfoCircleOutlined />}
    showIcon
    closable
    className={["section-help", className].filter(Boolean).join(" ")}
    style={style}
  />
);

export default SectionHelp;
