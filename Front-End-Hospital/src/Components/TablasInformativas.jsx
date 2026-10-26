import React, { useState } from 'react';
import { Button } from 'antd';
import { TablaNutricionalView } from './TablaNutricionalView';
import { ArrowRightOutlined } from '@ant-design/icons';
import { HospitalIcon } from './HospitalIcon';
import { PageHeader } from './PageHeader';
import { SectionHelp } from './SectionHelp';

export const TablasInformativas = () => {
  const [selectedTable, setSelectedTable] = useState(null);

  const tablas = [
    {
      id: 'vegetales',
      titulo: 'Vegetales',
      descripcion: 'Información nutricional completa de vegetales y verduras',
      filePath: '/Vegetales.xls',
      iconName: 'groupVegetales',
      color: 'var(--success)',
    },
    {
      id: 'frutas',
      titulo: 'Frutas',
      descripcion: 'Valores nutricionales de frutas frescas y secas',
      filePath: '/Frutas.xls',
      iconName: 'groupFrutas',
      color: 'var(--warning)',
    },
    {
      id: 'pescados',
      titulo: 'Pescados',
      descripcion: 'Composición nutricional de pescados y mariscos',
      filePath: '/Pescados.xls',
      iconName: 'groupPescados',
      color: 'var(--info)',
    },
  ];

  const handleOpenTable = (tabla) => {
    setSelectedTable(tabla);
  };

  const handleCloseTable = () => {
    setSelectedTable(null);
  };

  if (selectedTable) {
    return <TablaNutricionalView tabla={selectedTable} onVolver={handleCloseTable} />;
  }

  return (
    <div className="page-wrapper">
      <PageHeader
        icon={<HospitalIcon name="tablasInfo" size={32} alt="" />}
        title="Tablas nutricionales"
        subtitle="Consultá la información nutricional de distintos alimentos"
      />

      <SectionHelp>
        Estas tablas muestran cuántas calorías, proteínas, carbohidratos, grasas y otros nutrientes tiene cada
        alimento, para que puedas armar tus comidas siguiendo las indicaciones de tu plan. Tocá un grupo de alimentos
        para ver su tabla completa.
      </SectionHelp>

      <div className="tablas-grid">
        {tablas.map((tabla) => (
          <div
            key={tabla.id}
            className="tabla-card"
            onClick={() => handleOpenTable(tabla)}
          >
            <div className="tabla-card-icon" style={{ backgroundColor: `${tabla.color}15` }}>
              <HospitalIcon name={tabla.iconName} size={40} alt={tabla.titulo} />
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
