import { Tag, Typography } from 'antd';
import React, { useState } from 'react';

// import { Link } from '@tanstack/react-router';

interface ArticleItemProps {
  title: string;
  date: string;
  category: string;
  image: string;
  className?: string;
  onClick?: () => void;
}

const ALT_IMAGE = '/assets/images/alt-image.jpg';

const ArticleItem: React.FC<ArticleItemProps> = ({
  title,
  date,
  category,
  image,
  onClick,
  className,
}) => {
  const [imgSrc, setImgSrc] = useState(image);

  return (
    <a
      className={className || ''}
      style={{ textDecoration: 'none' }}
      onClick={onClick}
    >
      <div
        style={{
          flexDirection: 'row',
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <div
          className=""
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '65%',
            justifyContent: 'space-between',
            flexGrow: 1,
          }}
        >
          <div className="article-title" style={{ fontSize: 18, flexGrow: 1 }}>
            {title}
          </div>
          <div
            className=""
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Tag className="" style={{}}>
              {category}
            </Tag>
            <Typography.Text className="" style={{}}>
              {date}
            </Typography.Text>
          </div>
        </div>
        <div
          className="article-image"
          style={{
            borderRadius: 10,
            width: '35%',
            aspectRatio: '16/9',
            overflow: 'hidden',
            background: '#f5f5f5',
            minWidth: 100,
            minHeight: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={imgSrc || '/assets/images/tranh-anh.jpg'}
            alt={title}
            onError={() => setImgSrc(ALT_IMAGE)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>
    </a>
  );
};

export default ArticleItem;
