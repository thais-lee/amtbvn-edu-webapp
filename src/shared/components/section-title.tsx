//section title
import { Link } from '@tanstack/react-router';
import { Col, Row, Space, Typography } from 'antd';
import React from 'react';
import { TbLabelImportantFilled } from 'react-icons/tb';

interface SectionTitleProps {
  title: string;
  description?: string;
  watchMore?: boolean;
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  description,
  watchMore,
}) => {
  const { Title, Text } = Typography;

  return (
    <div className="section-title">
      <Space style={{ display: 'flex', alignItems: 'center' }}>
        <TbLabelImportantFilled size={22} style={{ color: '#8B4513' }} />
        <Title level={3} style={{ color: '#8B4513' }}>
          {title}
        </Title>
      </Space>

      {watchMore && (
        <Link to="/" className="section-title-watch-more">
          Xem thêm
        </Link>
      )}
    </div>
  );
};

export default SectionTitle;
