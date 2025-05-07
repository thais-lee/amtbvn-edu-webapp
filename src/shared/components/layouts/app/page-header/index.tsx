import React from 'react';
import { Typography } from 'antd';
import './styles.css';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps): React.ReactElement {
  return (
    <div className="page-header">
      <Typography.Title level={2} className="page-header-title">
        {title}
      </Typography.Title>
      {subtitle && (
        <Typography.Text className="page-header-subtitle">
          {subtitle}
        </Typography.Text>
      )}
    </div>
  );
} 