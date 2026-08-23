import React from "react";
import { Tooltip, Typography } from "antd";

/**
 * Texto de celda con ellipsis y tooltip para tablas admin.
 * Si el contenido ya es un elemento React, se devuelve tal cual.
 */
export const AdminCellText = ({ children, lines = 1, className = "" }) => {
  if (children == null || children === "") {
    return <span className="admin-cell-empty">—</span>;
  }

  if (typeof children !== "string" && typeof children !== "number") {
    return children;
  }

  const text = String(children);

  return (
    <Tooltip title={text.length > 48 ? text : undefined} placement="topLeft">
      <Typography.Text
        ellipsis={{ rows: lines }}
        className={`admin-cell-text ${className}`.trim()}
      >
        {text}
      </Typography.Text>
    </Tooltip>
  );
};
