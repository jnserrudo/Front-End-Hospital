import React, { useMemo, useState, useEffect } from "react";
import { Table, Input, Button, Empty, Spin } from "antd";
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
  emptyText = "Sin registros",
}) => {
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

  const badgeLabel =
    isFiltered && total !== count
      ? `${total} filtrado${total !== 1 ? "s" : ""} · ${count} total`
      : `${count} en total`;

  const mobileList = (
    <div className="admin-list-mobile">
      <div className="admin-entity-cards-wrap">
        {loading ? (
          <div className="admin-entity-cards-loading">
            <Spin />
          </div>
        ) : paginatedData.length === 0 ? (
          <Empty description={emptyText} className="admin-entity-cards-empty" />
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
        loading={loading}
        rowKey={rowKey}
        size="middle"
        scroll={{ x: "max(100%, 720px)" }}
        tableLayout="fixed"
        pagination={false}
        locale={{ emptyText }}
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
                <Button
                  type="primary"
                  size="middle"
                  icon={addButton.icon}
                  onClick={addButton.onClick}
                  loading={addButton.loading}
                  disabled={addButton.disabled}
                >
                  {addButton.label}
                </Button>
              )}
            </div>
          )}
        </div>

        {extraFilters && (
          <div className="admin-filters-row admin-card-filters">
            {extraFilters}
          </div>
        )}

        <div className="list-shell-body">
          {mobileList}
          {desktopTable}
        </div>

        <ListFooter
          total={total}
          current={currentPage}
          pageSize={pageSize}
          onChange={handlePageChange}
          pageSizeOptions={pageSizeOptions}
          loading={loading}
        />
      </div>
    </div>
  );
};
