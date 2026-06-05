import React, { useState } from 'react';
import { Button, Alert } from 'antd';
import { TablaNutricionalView } from './TablaNutricionalView';
import { 
  BarChartOutlined, 
  FileOutlined, 
  FileTextOutlined, 
  DatabaseOutlined,
  ArrowRightOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';

export const TablasInformativas = () => {
  const [selectedTable, setSelectedTable] = useState(null);

  const tablas = [
    {
      id: 'vegetales',
      titulo: 'Vegetales',
      descripcion: 'Información nutricional completa de vegetales y verduras',
      filePath: '/Vegetales.xls',
      icon: <FileTextOutlined />,
      color: 'var(--success)',
    },
    {
      id: 'frutas',
      titulo: 'Frutas',
      descripcion: 'Valores nutricionales de frutas frescas y secas',
      filePath: '/Frutas.xls',
      icon: <FileOutlined />,
      color: 'var(--warning)',
    },
    {
      id: 'pescados',
      titulo: 'Pescados',
      descripcion: 'Composición nutricional de pescados y mariscos',
      filePath: '/Pescados.xls',
      icon: <DatabaseOutlined />,
      color: 'var(--info)',
    },
  ];

  const handleOpenTable = (tabla) => {
    setSelectedTable(tabla);
  };

  const handleCloseTable = () => {
    setSelectedTable(null);
  };

  // Si hay una tabla seleccionada, mostrar la vista fullscreen
  if (selectedTable) {
    return <TablaNutricionalView tabla={selectedTable} onVolver={handleCloseTable} />;
  }

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 'var(--radius-md)',
            background: 'var(--primary-100)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)',
            fontSize: 26,
          }}>
            <BarChartOutlined />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>
              Tablas Nutricionales
            </h2>
            <p style={{ margin: 0, color: 'var(--gray-500)', fontSize: 'var(--font-size-base)' }}>
              Consulta la información nutricional de diferentes alimentos
            </p>
          </div>
        </div>
      </div>

      <Alert
        message="¿Cómo usar esta sección?"
        description="Consulta tablas nutricionales de alimentos. Haz clic en una categoría para ver información detallada sobre calorías, proteínas, carbohidratos y otros nutrientes."
        type="info"
        icon={<InfoCircleOutlined />}
        showIcon
        closable
        style={{ marginBottom: 24, borderRadius: "var(--radius-md)" }}
      />

      {/* Grid de Cards */}
      <div className="tablas-grid">
        {tablas.map((tabla) => (
          <div
            key={tabla.id}
            className="tabla-card"
            onClick={() => handleOpenTable(tabla)}
          >
            <div className="tabla-card-icon" style={{ backgroundColor: `${tabla.color}15`, color: tabla.color }}>
              {tabla.icon}
            </div>
            <h3>{tabla.titulo}</h3>
            <p>{tabla.descripcion}</p>
            <Button
              type="primary"
              style={{
                borderRadius: 'var(--radius)',
                fontWeight: 600,
              }}
            >
              Ver Tabla <ArrowRightOutlined style={{ marginLeft: 4 }} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
