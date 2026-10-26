import React from "react";
import { Button, Dropdown } from "antd";
import { MoreOutlined } from "@ant-design/icons";

/**
 * Acciones de fila de un listado: un único botón «⋮» (Acciones) que abre un menú
 * con las acciones de esa tabla. Las destructivas se muestran en rojo y las que no
 * están disponibles aparecen deshabilitadas con el motivo debajo.
 * actions: [{ key, label, icon, onClick, danger, disabled, disabledReason, hidden }]
 */
export const RowActions = ({ actions = [], label = "Acciones" }) => {
  const visibles = actions.filter((a) => !a.hidden);
  if (!visibles.length) return null;

  const items = visibles.map((a) => ({
    key: a.key,
    icon: a.icon,
    danger: Boolean(a.danger) && !a.disabled,
    disabled: Boolean(a.disabled),
    title: a.disabled ? a.disabledReason || "No disponible" : undefined,
    label: a.disabled ? (
      <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.3 }}>
        <span>{a.label}</span>
        {a.disabledReason && (
          <span style={{ fontSize: 12, color: "var(--gray-500)", whiteSpace: "normal", maxWidth: 240 }}>
            {a.disabledReason}
          </span>
        )}
      </span>
    ) : (
      a.label
    ),
  }));

  const onClick = ({ key, domEvent }) => {
    domEvent?.stopPropagation?.();
    const a = visibles.find((x) => String(x.key) === String(key));
    if (a && !a.disabled) a.onClick?.();
  };

  return (
    <div className="cont_acciones" style={{ display: "flex", justifyContent: "center" }} onClick={(e) => e.stopPropagation()}>
      <Dropdown trigger={["click"]} placement="bottomRight" menu={{ items, onClick }} destroyPopupOnHide>
        <Button
          type="text"
          size="small"
          icon={<MoreOutlined style={{ fontSize: 18 }} />}
          aria-label={label}
          title={label}
          aria-haspopup="menu"
        />
      </Dropdown>
    </div>
  );
};

export default RowActions;
