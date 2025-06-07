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
        }}
      >
        <div
          className=""
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '65%',
            justifyContent: 'space-between',
          }}
        >
          <div className="article-title" style={{ fontSize: 18 }}>
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
          style={{ borderRadius: 10, width: '35%' }}
        >
          <img src={imgSrc} alt={title} onError={() => setImgSrc(ALT_IMAGE)} />
        </div>
      </div>
    </a>
  );
};

export default ArticleItem;
