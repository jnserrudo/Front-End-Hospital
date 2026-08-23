import React from "react";
import { Pagination, ConfigProvider } from "antd";
import esES from "antd/locale/es_ES";

const DEFAULT_PAGE_SIZE_OPTIONS = [8, 10, 25, 50];

const paginationLocale = {
  ...esES.Pagination,
  items_per_page: "/ pág.",
};

/**
 * Footer unificado para listados: rango de registros, paginación y tamaño de página.
 * Siempre visible cuando total > 0.
 */
export const ListFooter = ({
  total = 0,
  current = 1,
  pageSize = 8,
  onChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  loading = false,
  itemLabel = "registros",
}) => {
  if (total <= 0 && !loading) {
    return null;
  }

  const start = total === 0 ? 0 : (current - 1) * pageSize + 1;
  const end = Math.min(current * pageSize, total);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const handleChange = (page, size) => {
    if (onChange) {
      onChange(page, size);
    }
  };

  return (
    <div className="list-footer">
      <div className="list-footer-info">
        <span className="list-footer-range">
          {total === 0
            ? "Sin registros"
            : `Mostrando ${start}–${end} de ${total} ${itemLabel}`}
        </span>
        <span className="list-footer-page-hint">
          Pág. {current} de {totalPages}
        </span>
      </div>
      <ConfigProvider locale={{ ...esES, Pagination: paginationLocale }}>
        <Pagination
          className="list-footer-pagination"
          current={current}
          pageSize={pageSize}
          total={total}
          onChange={handleChange}
          onShowSizeChange={handleChange}
          showSizeChanger
          pageSizeOptions={pageSizeOptions.map(String)}
          disabled={loading}
          showLessItems
        />
      </ConfigProvider>
    </div>
  );
};
