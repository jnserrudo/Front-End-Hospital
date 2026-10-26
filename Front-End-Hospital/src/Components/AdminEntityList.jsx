import React, { useMemo, useState, useEffect } from "react";
import { Table, Input, Button, Empty, Spin, Tooltip, Segmented } from "antd";
import { DeshabilitadosList } from "./DeshabilitadosList";
import { SearchOutlined } from "@ant-design/icons";
import {
  normalizeAdminColumns,
  getDetailColumns,
  getCellContent,
  getColumnKey,
} from "../utils/normalizeAdminColumns";
import { AdminEntityCard } from "./AdminEntityCard";
import { ListFooter } from "./ListFooter";

const DEFAULT_PAGE_SIZE_OPTIONS = [8, 10, 25, 50];

/**
 * Listado admin: shell de 4 zonas (toolbar, filtros, contenido, footer).
 * Solo el body crece; toolbar/footer no se estiran.
 */
export const AdminEntityList = ({
  title,
  count = 0,
  searchProps = null,
  addButton = null,
  extraFilters = null,
  columns = [],
  dataSource = [],
  loading = false,
  rowKey = "id",
  pageSize: initialPageSize = 8,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  emptyText = "Todavía no hay nada cargado acá. Usá el botón «Agregar» para crear el primero.",
  loadingText = "Cargando…",
  // Borrado lógico: { entidad, singular, articulo, onRestored } agrega el filtro
  // Activos / Deshabilitados y la acción «Habilitar» en los deshabilitados.
  estado = null,
}) => {
  const [vista, setVista] = useState("activos");
  const [countDeshab, setCountDeshab] = useState(null);
  const verDeshabilitados = Boolean(estado) && vista === "deshabilitados";
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [dataSource.length, searchProps?.value, pageSize]);

  const normalizedColumns = useMemo(
    () => normalizeAdminColumns(columns),
    [columns]
  );

  const detailColumns = useMemo(
    () => getDetailColumns(normalizedColumns),
    [normalizedColumns]
  );

  const total = dataSource.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return dataSource.slice(start, start + pageSize);
  }, [dataSource, currentPage, pageSize]);

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    if (size !== pageSize) {
      setPageSize(size);
    }
  };

  const isFiltered = Boolean(
    searchProps?.value && String(searchProps.value).trim()
  );

  const searchTerm = isFiltered ? String(searchProps.value).trim() : "";
  const clearSearch = () => searchProps?.onChange?.({ target: { value: "" } });
  // Búsqueda sin resultados: nunca mostramos la lista completa, lo decimos claro.
  const emptyContent = isFiltered ? (
    <Empty
      description={`No encontramos resultados para «${searchTerm}». Probá con otra palabra o revisá los filtros.`}
    >
      <Button onClick={clearSearch}>Limpiar búsqueda</Button>
    </Empty>
  ) : (
    <Empty description={emptyText} />
  );

  // Mientras carga no mostramos «vacío» ni «0 en total»: todavía no sabemos.
  const loadingContent = (
    <div style={{ padding: "32px 0", textAlign: "center" }} role="status" aria-live="polite">
      <Spin />
      <div style={{ marginTop: 8, color: "var(--gray-500)" }}>{loadingText}</div>
    </div>
  );

  const badgeLabel = verDeshabilitados
    ? countDeshab === null ? "Cargando…" : `${countDeshab} deshabilitado${countDeshab !== 1 ? "s" : ""}`
    : loading && count === 0
    ? "Cargando…"
    : isFiltered && total !== count
    ? `${total} filtrado${total !== 1 ? "s" : ""} · ${count} total`
    : `${count} en total`;

  const mobileList = (
    <div className="admin-list-mobile">
      <div className="admin-entity-cards-wrap">
        {loading ? (
          <div className="admin-entity-cards-loading">{loadingContent}</div>
        ) : paginatedData.length === 0 ? (
          <div className="admin-entity-cards-empty">{emptyContent}</div>
        ) : (
          <div className="admin-entity-cards">
            {paginatedData.map((record) => (
              <AdminEntityCard
                key={record[rowKey] ?? record.id}
                record={record}
                columns={normalizedColumns}
                rowKey={rowKey}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const desktopTable = (
    <div className="admin-list-desktop">
      <Table
        className="admin-table admin-table--controlled"
        columns={normalizedColumns}
        dataSource={paginatedData}
        loading={loading && paginatedData.length > 0}
        rowKey={rowKey}
        size="middle"
        scroll={{ x: "max(100%, 720px)" }}
        tableLayout="fixed"
        pagination={false}
        locale={{ emptyText: loading ? loadingContent : emptyContent }}
        expandable={
          detailColumns.length > 0
            ? {
                expandedRowRender: (record) => (
                  <div className="admin-row-detail">
                    {detailColumns.map((col) => (
                      <div
                        className="admin-row-detail-field"
                        key={getColumnKey(col)}
                      >
                        <span className="admin-row-detail-label">
                          {col.title}
                        </span>
                        <div className="admin-row-detail-value">
                          {getCellContent(col, record)}
                        </div>
                      </div>
                    ))}
                  </div>
                ),
                rowExpandable: () => detailColumns.length > 0,
              }
            : undefined
        }
      />
    </div>
  );

  return (
    <div className="admin-page-wrapper">
      <div className="admin-card admin-card--responsive list-shell">
        <div className="admin-card-header admin-list-toolbar">
          <div className="admin-card-title admin-list-toolbar-title">
            <h3>{title}</h3>
            <span className="admin-badge">{badgeLabel}</span>
          </div>
          {(searchProps || addButton) && (
            <div className="admin-card-actions admin-list-toolbar-controls">
              {searchProps && (
                <Input
                  className="admin-card-search"
                  size="middle"
                  prefix={
                    <SearchOutlined style={{ color: "var(--gray-400)" }} />
                  }
                  allowClear
                  {...searchProps}
                />
              )}
              {addButton && (
                <Tooltip title={addButton.disabled ? addButton.disabledReason : ""}>
                  <span style={{ display: "inline-block", cursor: addButton.disabled ? "not-allowed" : undefined }}>
                    <Button
                      type="primary"
                      size="middle"
                      icon={addButton.icon}
                      onClick={addButton.onClick}
                      loading={addButton.loading}
                      disabled={addButton.disabled}
                      style={addButton.disabled ? { pointerEvents: "none" } : undefined}
                    >
                      {addButton.label}
                    </Button>
                  </span>
                </Tooltip>
              )}
            </div>
          )}
        </div>

        {(extraFilters || estado) && (
          <div className="admin-filters-row admin-card-filters">
            {estado && (
              <Segmented
                value={vista}
                onChange={(v) => {
                  setVista(v);
                  setCountDeshab(null);
                }}
                options={[
                  { label: "Activos", value: "activos" },
                  { label: "Deshabilitados", value: "deshabilitados" },
                ]}
              />
            )}
            {extraFilters}
          </div>
        )}

        <div className="list-shell-body">
          {verDeshabilitados ? (
            <DeshabilitadosList
              entidad={estado.entidad}
              singular={estado.singular}
              articulo={estado.articulo}
              search={searchProps?.value || ""}
              onRestored={estado.onRestored}
              onCount={setCountDeshab}
            />
          ) : (
            <>
              {mobileList}
              {desktopTable}
            </>
          )}
        </div>

        {!verDeshabilitados && (
          <ListFooter
            total={total}
            current={currentPage}
            pageSize={pageSize}
            onChange={handlePageChange}
            pageSizeOptions={pageSizeOptions}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};
