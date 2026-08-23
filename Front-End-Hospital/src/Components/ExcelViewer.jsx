import React, { useEffect, useState, useMemo } from "react";
import * as XLSX from "xlsx";
import { Table, Button, Empty } from "antd";
import { ListFooter } from "./ListFooter";

const ExcelViewer = ({ filePath, toggleMessage }) => {
  const [data, setData] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [headers, setHeaders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (isVisible) {
      setCurrentPage(1);
      fetch(filePath)
        .then((response) => response.arrayBuffer())
        .then((buffer) => {
          const workbook = XLSX.read(buffer, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          let headerRow = 0;
          let maxCells = 0;
          json.forEach((row, index) => {
            const nonEmptyCells = row.filter(
              (cell) => cell !== undefined && cell !== ""
            ).length;
            if (nonEmptyCells > maxCells) {
              maxCells = nonEmptyCells;
              headerRow = index;
            }
          });

          const slicedData = json.slice(headerRow + 1);

          setHeaders(json[headerRow]);
          setData(slicedData.map((row, index) => ({ key: index, ...row })));
        })
        .catch((error) => console.error("Error loading excel file:", error));
    }
  }, [filePath, isVisible]);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const columns = headers.map((header, index) => ({
    title: header,
    dataIndex: index,
    key: index,
    width: Math.min(Math.max(String(header ?? "").length * 8, 80), 200),
    ellipsis: true,
    render: (text) => text ?? "—",
  }));

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, currentPage, pageSize]);

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));

  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize, data.length]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    if (size !== pageSize) {
      setPageSize(size);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Button onClick={toggleVisibility} type="primary" style={{ marginBottom: 16 }}>
        {isVisible ? "Ocultar Tabla" : toggleMessage}
      </Button>
      {isVisible && data.length > 0 && (
        <div className="excel-viewer-responsive list-shell">
          <div className="list-shell-body">
            <div className="excel-list-mobile">
              <div className="admin-entity-cards-wrap">
                <div className="admin-entity-cards">
                  {paginatedData.map((row) => (
                    <article
                      className="admin-entity-card admin-entity-card--compact"
                      key={row.key}
                    >
                      <div className="admin-entity-card-top">
                        <h4 className="admin-entity-card-title">
                          {row[0] ?? `Fila ${row.key + 1}`}
                        </h4>
                      </div>
                      <div className="admin-entity-card-fields">
                        {headers.slice(1).map((header, index) => (
                          <div className="admin-entity-card-field" key={index + 1}>
                            <span className="admin-entity-card-field-label">
                              {header}
                            </span>
                            <div className="admin-entity-card-field-value">
                              {row[index + 1] ?? "—"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
            <div className="excel-list-desktop">
              <Table
                className="admin-table admin-table--controlled"
                columns={columns}
                dataSource={paginatedData}
                pagination={false}
                size="small"
                bordered
                tableLayout="fixed"
                scroll={{ x: "max(100%, 640px)" }}
              />
            </div>
          </div>

          <ListFooter
            total={data.length}
            current={currentPage}
            pageSize={pageSize}
            onChange={handlePageChange}
            pageSizeOptions={[10, 25, 50, 100]}
            itemLabel="filas"
          />
        </div>
      )}
      {isVisible && data.length === 0 && <Empty description="Sin datos" />}
    </div>
  );
};

export default ExcelViewer;
