import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { Table, Button } from 'antd';
import { Box } from '@chakra-ui/react';

const ExcelViewer = ({ filePath, toggleMessage }) => {
  const [data, setData] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [headers, setHeaders] = useState([]);

  useEffect(() => {
    if (isVisible) {
      fetch(filePath)
        .then(response => response.arrayBuffer())
        .then(buffer => {
          const workbook = XLSX.read(buffer, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          // Identificar la fila con más celdas no vacías
          let headerRow = 0;
          let maxCells = 0;
          json.forEach((row, index) => {
            const nonEmptyCells = row.filter(cell => cell !== undefined && cell !== "").length;
            if (nonEmptyCells > maxCells) {
              maxCells = nonEmptyCells;
              headerRow = index;
            }
          });

          const slicedData = json.slice(headerRow + 1);

          setHeaders(json[headerRow]);
          setData(slicedData.map((row, index) => ({ key: index, ...row })));
        })
        .catch(error => console.error('Error loading excel file:', error));
    }
  }, [filePath, isVisible]);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const columns = headers.map((header, index) => ({
    title: header,
    dataIndex: index,
    key: index,
  }));

  return (
    <div style={{textAlign:'center'}} >
      <Button onClick={toggleVisibility} type="primary" style={{ marginBottom: 16 }}>
        {isVisible? 'Ocultar Tabla': toggleMessage}
      </Button>
      {isVisible && data.length > 0 && (
        <Box overflowX="auto">
          <Table
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 10, position: ["bottomRight"] }}
          />
        </Box>
      )}
    </div>
  );
};

export default ExcelViewer;
