import React, { useEffect, useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { Table, Button, Tabs, Spin, Pagination, Select, ConfigProvider } from 'antd';
import esES from "antd/locale/es_ES";
import { ArrowLeftOutlined, FileTextOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

// Función para clasificar columnas en categorías
function clasificarColumnas(headers) {
  const categorias = {
    general: [],
    vitaminas: [],
    minerales: [],
    lipidos: [],
    aminoacidos: [],
    otros: []
  };

  const vitaminasKeywords = ['vitamina', 'tiamina', 'riboflavina', 'niacina', 'piridoxina', 'cobalamina', 
    'ascorbico', 'calciferol', 'tocoferol', 'folato', 'ácido fólico', 'retinol', 'caroteno'];
  
  const mineralesKeywords = ['calcio', 'hierro', 'zinc', 'sodio', 'potasio', 'fósforo', 'magnesio', 
    'selenio', 'cobre', 'manganeso', 'fosforo', 'cromo', 'molibdeno', 'yodo', 'fluor'];
  
  const lipidosKeywords = ['grasa', 'lípido', 'lípidos', 'saturad', 'insaturad', 'monoinsaturad', 
    'poliinsaturad', 'linoleico', 'linolénico', 'araquidónico', 'oleico', 'estearico', 'palmítico',
    'butírico', 'miristico', 'láurico', 'omega'];
  
  const aminoacidosKeywords = ['lisina', 'metionina', 'fenilalanina', 'treonina', 'triptófano', 
    'valina', 'leucina', 'isoleucina', 'histidina', 'alanina', 'arginina', 'aspartico', 'cistina',
    'glutámico', 'glicina', 'prolina', 'serina', 'tirosina'];

  headers.forEach((header, index) => {
    if (index === 0) {
      // Primera columna siempre va a General (nombre del alimento)
      categorias.general.push(index);
      return;
    }

    const lower = header.toLowerCase();
    
    if (vitaminasKeywords.some(v => lower.includes(v))) {
      categorias.vitaminas.push(index);
    }
    else if (mineralesKeywords.some(m => lower.includes(m))) {
      categorias.minerales.push(index);
    }
    else if (lipidosKeywords.some(l => lower.includes(l))) {
      categorias.lipidos.push(index);
    }
    else if (aminoacidosKeywords.some(a => lower.includes(a))) {
      categorias.aminoacidos.push(index);
    }
    else if (['alimento', 'nombre', 'categoría', 'categoria', 'grupo', 'energía', 'energia', 
              'calorías', 'calorias', 'proteín', 'proteina', 'carbohidrato', 'hidratos', 
              'fibra', 'agua', 'colesterol', 'cenizas', 'humedad', 'extracto etereo'].some(g => lower.includes(g))) {
      categorias.general.push(index);
    }
    else {
      categorias.otros.push(index);
    }
  });

  return categorias;
}

// Obtener nombre legible para la categoría
function getCategoriaLabel(categoria, count) {
  const labels = {
    general: `General (${count})`,
    vitaminas: `Vitaminas (${count})`,
    minerales: `Minerales (${count})`,
    lipidos: `Lípidos (${count})`,
    aminoacidos: `Aminoácidos (${count})`,
    otros: `Otros (${count})`
  };
  return labels[categoria] || `${categoria} (${count})`;
}

export const TablaNutricionalView = ({ tabla, onVolver }) => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (tabla?.filePath) {
      setLoading(true);
      setError(null);
      
      fetch(tabla.filePath)
        .then(response => {
          if (!response.ok) throw new Error('No se pudo cargar el archivo');
          return response.arrayBuffer();
        })
        .then(buffer => {
          const workbook = XLSX.read(buffer, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          // Identificar la fila con más celdas no vacías (header row)
          let headerRow = 0;
          let maxCells = 0;
          json.forEach((row, index) => {
            const nonEmptyCells = row.filter(cell => cell !== undefined && cell !== "").length;
            if (nonEmptyCells > maxCells) {
              maxCells = nonEmptyCells;
              headerRow = index;
            }
          });

          const slicedHeaders = json[headerRow];
          const slicedData = json.slice(headerRow + 1);

          setHeaders(slicedHeaders);
          setData(slicedData.map((row, index) => ({ key: index, ...row })));
          setLoading(false);
        })
        .catch(error => {
          console.error('Error loading excel file:', error);
          setError('Error al cargar la tabla nutricional');
          setLoading(false);
        });
    }
  }, [tabla]);

  // Clasificar columnas en categorías
  const categorias = useMemo(() => {
    if (headers.length === 0) return {};
    return clasificarColumnas(headers);
  }, [headers]);

  // Filtrar categorías vacías
  const categoriasConDatos = useMemo(() => {
    return Object.entries(categorias).filter(([_, indices]) => indices.length > 0);
  }, [categorias]);

  // Si la categoría activa no tiene datos, cambiar a la primera disponible
  useEffect(() => {
    if (categoriasConDatos.length > 0 && !categorias[activeTab]?.length) {
      setActiveTab(categoriasConDatos[0][0]);
    }
  }, [categorias, activeTab, categoriasConDatos]);

  // Generar columnas para la tabla según la categoría activa
  const columns = useMemo(() => {
    if (headers.length === 0) return [];
    
    // Obtenemos los índices de la categoría activa
    const indices = categorias[activeTab] || [];
    
    // Buscamos si la columna 0 es el número (Nº) y la 1 es el Alimento
    const hasNum = headers[0] && (headers[0].toLowerCase().includes('nº') || headers[0].toLowerCase().includes('n°') || headers[0].toLowerCase().includes('num') || headers[0].toLowerCase() === 'no' || headers[0].toLowerCase() === 'no.');
    const hasAlimento = headers[1] && (headers[1].toLowerCase().includes('alimento') || headers[1].toLowerCase().includes('nombre') || headers[1].toLowerCase().includes('descrip'));
    
    // Filtramos los índices 0 y 1 de los índices de la categoría para evitar duplicados
    let filteredIndices = [...indices];
    if (hasNum) {
      filteredIndices = filteredIndices.filter(idx => idx !== 0);
    }
    if (hasAlimento) {
      filteredIndices = filteredIndices.filter(idx => idx !== 1);
    }
    
    // Forzamos que la columna de Nº y Alimento estén siempre al principio en cada pestaña
    const prefixIndices = [];
    if (hasNum) prefixIndices.push(0);
    if (hasAlimento) prefixIndices.push(1);
    
    const allIndices = [...prefixIndices, ...filteredIndices];
    
    return allIndices.map(index => {
      const title = headers[index] || '';
      
      let width = 100;
      let fixed = undefined;
      
      if (index === 0 && hasNum) {
        width = 70;
        fixed = 'left';
      } else if (index === 1 && hasAlimento) {
        width = 220;
        fixed = 'left';
      } else {
        width = title.length > 20 ? 180 : (title.length > 12 ? 140 : 100);
      }
      
      return {
        title: title,
        dataIndex: index,
        key: index,
        width: width,
        fixed: fixed,
        sorter: (a, b) => {
          const valA = parseFloat(a[index]) || 0;
          const valB = parseFloat(b[index]) || 0;
          return valA - valB;
        },
        render: (text) => {
          const num = parseFloat(text);
          if (!isNaN(num) && typeof text === 'number') {
            return num.toLocaleString('es-AR', { maximumFractionDigits: 2 });
          }
          return text || '-';
        }
      };
    });
  }, [headers, categorias, activeTab]);

  // Datos paginados
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, currentPage, pageSize]);

  // Verificar si es mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Renderizar tabs o select según el dispositivo
  const renderTabs = () => {
    const tabItems = categoriasConDatos.map(([categoria, indices]) => ({
      key: categoria,
      label: getCategoriaLabel(categoria, indices.length),
    }));

    if (isMobile) {
      return (
        <div style={{ padding: '12px 24px', background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)' }}>
          <Select
            value={activeTab}
            onChange={setActiveTab}
            style={{ width: '100%' }}
            options={tabItems.map(item => ({ value: item.key, label: item.label }))}
            size="large"
          />
        </div>
      );
    }

    return (
      <div style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)' }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          type="card"
          style={{ padding: '0 24px' }}
          items={tabItems.map(item => ({
            key: item.key,
            label: item.label,
          }))}
        />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="tabla-fullscreen-container tabla-fullscreen-enter">
        <div className="tabla-fullscreen-header">
          <Button icon={<ArrowLeftOutlined />} onClick={onVolver} className="tabla-volver-btn">
            Volver
          </Button>
          <div className="tabla-fullscreen-title">
            <FileTextOutlined /> {tabla?.titulo}
          </div>
          <div style={{ width: 80 }} />
        </div>
        <div className="tabla-fullscreen-content tabla-fullscreen-loading">
          <Spin size="large" tip="Cargando tabla nutricional..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tabla-fullscreen-container tabla-fullscreen-enter">
        <div className="tabla-fullscreen-header">
          <Button icon={<ArrowLeftOutlined />} onClick={onVolver} className="tabla-volver-btn">
            Volver
          </Button>
          <div className="tabla-fullscreen-title">
            <FileTextOutlined /> {tabla?.titulo}
          </div>
          <div style={{ width: 80 }} />
        </div>
        <div className="tabla-fullscreen-content tabla-fullscreen-error">
          <FileTextOutlined style={{ fontSize: 48, color: 'var(--gray-300)' }} />
          <p>{error}</p>
          <Button type="primary" onClick={onVolver}>Volver a las tablas</Button>
        </div>
      </div>
    );
  }

  return (
    <ConfigProvider locale={esES}>
      <div className="tabla-fullscreen-container tabla-fullscreen-enter">
        {/* Header */}
        <div className="tabla-fullscreen-header">
          <Button icon={<ArrowLeftOutlined />} onClick={onVolver} className="tabla-volver-btn">
            Volver
          </Button>
          <div className="tabla-fullscreen-title">
            {tabla?.icon && <span style={{ marginRight: 8 }}>{tabla.icon}</span>}
            Tabla Nutricional - {tabla?.titulo}
          </div>
          <div style={{ width: 80 }} />
        </div>

        {/* Tabs */}
        {renderTabs()}

        {/* Content */}
        <div className="tabla-fullscreen-content">
          <div className="tabla-fullscreen-table-wrapper">
            <Table
              columns={columns}
              dataSource={paginatedData}
              pagination={false}
              size="small"
              bordered
              scroll={{ x: 'max-content', y: 'calc(100vh - 280px)' }}
              rowClassName={(_, index) => index % 2 === 0 ? 'tabla-row-even' : 'tabla-row-odd'}
            />
          </div>

          {/* Pagination */}
          <div className="tabla-fullscreen-pagination">
            <span className="tabla-pagination-info">
              Mostrando {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, data.length)} de {data.length} alimentos
            </span>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={data.length}
              onChange={setCurrentPage}
              showSizeChanger
              pageSizeOptions={[10, 25, 50, 100]}
              onShowSizeChange={(_, size) => { setPageSize(size); setCurrentPage(1); }}
            />
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default TablaNutricionalView;
