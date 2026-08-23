import React from "react";
import {
  getPrimaryColumn,
  getMetaColumns,
  getBodyColumns,
  getCellContent,
  isActionsColumn,
  isIdColumn,
  isPrimaryColumn,
  getColumnKey,
} from "../utils/normalizeAdminColumns";

const WIDE_FIELD_KEYS = /descripcion|descripción|pregunta|respuesta|titulo|ejercicio|profesional|scores|observacion/i;

const isWideField = (col) => {
  const key = getColumnKey(col).toLowerCase();
  const title = String(col.title ?? "").toLowerCase();
  return WIDE_FIELD_KEYS.test(key) || WIDE_FIELD_KEYS.test(title);
};

export const AdminEntityCard = ({ record, columns, rowKey }) => {
  const primaryCol = getPrimaryColumn(columns);
  const idCol = columns.find((col) => isIdColumn(col) && !isPrimaryColumn(col));
  const metaCols = getMetaColumns(columns).filter((col) => !isIdColumn(col));
  const bodyCols = getBodyColumns(columns);
  const actionsCol = columns.find(isActionsColumn);
  const key = record[rowKey] ?? record.id;

  return (
    <article className="admin-entity-card admin-entity-card--compact">
      <div className="admin-entity-card-top">
        <h4 className="admin-entity-card-title">
          {primaryCol ? getCellContent(primaryCol, record) : `#${key}`}
        </h4>
        {idCol && (
          <span className="admin-entity-card-id-chip">
            {getCellContent(idCol, record)}
          </span>
        )}
      </div>

      {metaCols.length > 0 && (
        <div className="admin-entity-card-meta">
          {metaCols.map((col) => (
            <div className="admin-entity-card-meta-item" key={getColumnKey(col)}>
              <span className="admin-entity-card-meta-label">{col.title}</span>
              <span className="admin-entity-card-meta-value">
                {getCellContent(col, record)}
              </span>
            </div>
          ))}
        </div>
      )}

      {bodyCols.length > 0 && (
        <div className="admin-entity-card-fields">
          {bodyCols.map((col) => (
            <div
              className={`admin-entity-card-field${
                isWideField(col) ? " admin-entity-card-field--wide" : ""
              }`}
              key={getColumnKey(col)}
            >
              <span className="admin-entity-card-field-label">{col.title}</span>
              <div className="admin-entity-card-field-value">
                {getCellContent(col, record)}
              </div>
            </div>
          ))}
        </div>
      )}

      {actionsCol && (
        <div className="admin-entity-card-actions">
          {getCellContent(actionsCol, record)}
        </div>
      )}
    </article>
  );
};
