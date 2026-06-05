import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

export const LoadingOverlay = ({ loading, message = 'Procesando...' }) => {
  if (!loading) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-overlay-content">
        <Spin
          indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
          size="large"
        />
        <p className="loading-overlay-message">{message}</p>
      </div>
    </div>
  );
};
