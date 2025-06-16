import { css } from '@emotion/react';
import { useNavigate } from '@tanstack/react-router';
import { Card } from 'antd';

interface MasterContentProps {
  title: string;
  content: string;
  cover: string;
}

const tabContent = [
  {
    id: 37,
    title: 'Tiểu sử',
    content: 'Tiểu sử lão Pháp Sư',
    cover:
      'https://amtbvn.org/wp-content/uploads/2021/03/aboutmaster-gioithieuht.jpg',
  },
  {
    id: 38,
    title: 'Sư Thừa',
    content: 'Những người thầy của lão Pháp Sư',
    cover: 'https://amtbvn.org/wp-content/uploads/2021/03/lineage-su-thua.jpg',
  },
  {
    id: 39,
    title: 'Lý niệm',
    content: 'Lý niệm hoằng pháp lão Pháp Sư',
    cover: 'https://amtbvn.org/wp-content/uploads/2021/03/concept-lyniem.jpg',
  },
  {
    id: 40,
    title: 'Đồng Đạo',
    content: 'Những người bạn đạo cùng chung chí hướng',
    cover:
      'https://amtbvn.org/wp-content/uploads/2021/05/SF-01-006-600x338.jpg',
  },
];

const MasterContent = (_: MasterContentProps) => {
  const navigate = useNavigate();
  return (
    <div>
      {tabContent.map((item) => (
        <Card
          css={css`
            border-radius: 10px;
            box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
            margin-bottom: 10px;
            //add hover effect
            transition: all 0.3s ease;
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: '0 0 20px 0 rgba(0, 0, 0, 0.2)',
            }
            -webkit-tap-highlight-color: transparent;
            -webkit-touch-callout: none;
          `}
          hoverable
          key={item.title}
          cover={<img alt={item.title} src={item.cover} />}
          onClick={() => {
            navigate({
              to: '/m/home/articles/$categoryId',
              params: { categoryId: item.id.toString() },
            });
          }}
        >
          <Card.Meta title={item.title} description={item.content} />
        </Card>
      ))}
    </div>
  );
};

export default MasterContent;
