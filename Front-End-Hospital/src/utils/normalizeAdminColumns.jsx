import React from "react";
import { AdminCellText } from "../Components/AdminCellText";

const ACTION_KEYS = new Set(["acciones", "accion", "actions"]);
const ID_KEYS = new Set(["id", "dni"]);
const PRIMARY_KEYS = new Set([
  "nombre",
  "titulo",
  "pregunta",
  "usuario",
  "paciente",
]);
const DETAIL_KEYS = new Set([
  "descripcion",
  "respuesta",
  "ejercicio",
  "profesional",
  "scores",
  "tipoalmacenamiento",
  "almacenamiento",
]);

export const getColumnKey = (col) =>
  String(col.key ?? col.dataIndex ?? col.title ?? "");

const colKeyLower = (col) => getColumnKey(col).toLowerCase();

export const isActionsColumn = (col) => {
  const key = colKeyLower(col);
  const title = String(col.title ?? "").toLowerCase();
  return ACTION_KEYS.has(key) || title.includes("accion");
};

export const isIdColumn = (col) => {
  const key = colKeyLower(col);
  const title = String(col.title ?? "").toLowerCase();
  return ID_KEYS.has(key) || title === "id" || title === "dni";
};

export const isPrimaryColumn = (col) => PRIMARY_KEYS.has(colKeyLower(col));

export const isDetailColumn = (col) => {
  if (isActionsColumn(col) || isIdColumn(col)) return false;
  const key = colKeyLower(col);
  const title = String(col.title ?? "").toLowerCase();
  if (DETAIL_KEYS.has(key)) return true;
  return (
    title.includes("descripcion") ||
    title.includes("descripción") ||
    title.includes("ejercicio / rutina") ||
    title.includes("medico") ||
    title.includes("médico") ||
    title.includes("dolor") ||
    title.includes("fatiga") ||
    title.includes("almacenamiento")
  );
};

const wrapTextRender = (col, lines = 1) => {
  const original = col.render;

  return (value, record, index) => {
    let content = value;
    if (original) {
      content = original(value, record, index);
    } else if (col.dataIndex != null) {
      content = record[col.dataIndex];
    }

    if (typeof content === "string" || typeof content === "number") {
      return <AdminCellText lines={lines}>{content}</AdminCellText>;
    }

    if (
      React.isValidElement(content) &&
      typeof content.props?.children === "string"
    ) {
      return (
        <AdminCellText lines={lines}>{content.props.children}</AdminCellText>
      );
    }

    return content ?? <span className="admin-cell-empty">—</span>;
  };
};

/**
 * Normaliza columnas Ant Design Table para evitar ensanchamiento por texto largo.
 */
export const normalizeAdminColumns = (columns = []) =>
  columns.map((col) => {
    if (isActionsColumn(col)) {
      return {
        ...col,
        width: col.width ?? 112,
        fixed: "right",
        align: col.align ?? "center",
        className: "admin-col-actions",
      };
    }

    if (isIdColumn(col)) {
      return {
        ...col,
        width: col.width ?? 80,
        align: col.align ?? "center",
        ellipsis: true,
        className: "admin-col-id",
      };
    }

    if (isDetailColumn(col)) {
      return {
        ...col,
        width: col.width ?? 200,
        ellipsis: true,
        responsive: col.responsive ?? ["lg"],
        _adminDetail: true,
        render: wrapTextRender(col, 2),
      };
    }

    if (isPrimaryColumn(col)) {
      return {
        ...col,
        width: col.width ?? 220,
        ellipsis: true,
        render: wrapTextRender(col, 2),
      };
    }

    return {
      ...col,
      width: col.width ?? 140,
      ellipsis: col.ellipsis !== false,
      ...(col.render ? {} : { render: wrapTextRender(col, 1) }),
    };
  });

export const getDetailColumns = (columns = []) =>
  columns.filter((col) => col._adminDetail === true);

export const getPrimaryColumn = (columns = []) => {
  const primary = columns.find(
    (col) => isPrimaryColumn(col) && !isActionsColumn(col)
  );
  if (primary) return primary;

  return columns.find(
    (col) =>
      !isActionsColumn(col) &&
      !isIdColumn(col) &&
      (col.dataIndex || col.render)
  );
};

export const getMetaColumns = (columns = []) =>
  columns.filter(
    (col) =>
      !isActionsColumn(col) &&
      !isPrimaryColumn(col) &&
      !isDetailColumn(col) &&
      (isIdColumn(col) ||
        colKeyLower(col).includes("categoria") ||
        colKeyLower(col).includes("tipo") ||
        colKeyLower(col).includes("fecha") ||
        colKeyLower(col).includes("createdat") ||
        colKeyLower(col).includes("alerta"))
  );

export const getBodyColumns = (columns = []) => {
  const meta = getMetaColumns(columns);
  return columns.filter(
    (col) =>
      !isActionsColumn(col) &&
      !isPrimaryColumn(col) &&
      !isIdColumn(col) &&
      !meta.includes(col)
  );
};

export const getCellContent = (col, record) => {
  const value = col.dataIndex != null ? record[col.dataIndex] : undefined;
  if (col.render) {
    return col.render(value, record);
  }
  return value ?? "—";
};
