import { LeftOutlined } from '@ant-design/icons';
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button, Typography } from 'antd';
import { useState } from 'react';

import ArticleItem from '@/shared/components/articleItem';

const mockArticles = [
  {
    id: '1',
    title: '法師簡介',
    desc: '澳洲格里菲斯大學、昆士蘭大學榮譽教授，中國人民大學客座教授 ...',
    img: 'https://amtbvn.org/wp-content/uploads/2021/05/SF-01-042-600x338.jpg',
  },
  {
    id: '2',
    title: '生平與貢獻',
    desc: '「普令眾生破迷啟悟，離苦得樂」是淨空老和尚和尚生命的真實意義。...',
    img: 'https://amtbvn.org/wp-content/uploads/2021/05/SF-01-042-600x338.jpg',
  },
  {
    id: '3',
    title: '重要理念',
    desc: '曾走過繁華閃亮的都市，或處於簡單樸實的鄉野，淨空法師，這位...',
    img: 'https://amtbvn.org/wp-content/uploads/2021/05/SF-01-042-600x338.jpg',
  },
  {
    id: '4',
    title: '弘法理念',
    desc: '「真誠、清淨、平等、正覺、慈悲；看破、放下、自在、隨緣 ...',
    img: 'https://amtbvn.org/wp-content/uploads/2021/05/SF-01-042-600x338.jpg',
  },
  {
    id: '5',
    title: '敦親睦鄰',
    desc: '世間人事物之環境，可說是重重無盡。現今社會中，人與人之間，...',
    img: 'https://amtbvn.org/wp-content/uploads/2021/05/SF-01-042-600x338.jpg',
  },
  {
    id: '6',
    title: '鄉下生活',
    desc: '現在地球的污染非常嚴重，其污染的根源無他，就是「人定勝天」...',
    img: 'https://amtbvn.org/wp-content/uploads/2021/05/SF-01-042-600x338.jpg',
    overlay: '鄉下生活',
  },
  {
    id: '7',
    title: '少時用錢',
    desc: '今天早晨，我於陳老居士的帽子 ...',
    img: 'https://amtbvn.org/wp-content/uploads/2021/05/SF-01-042-600x338.jpg',
    overlay: '少時用錢',
  },
];

export const Route = createFileRoute('/_app/m/home/articles/')({
  component: ArticleListPage,
});

function ArticleListPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  return (
    <div
      style={{
        background: '#f8f5ef',
        minHeight: '100vh',
        paddingBottom: 16,
        width: '100%',
      }}
    >
      {/* Header */}
      <div
        style={{
          position: 'relative',
          background: '#f8f5ef',
          padding: '16px 0',
          marginBottom: 16,
        }}
      >
        <Button
          type="text"
          icon={<LeftOutlined style={{ fontSize: 22 }} />}
          onClick={() => navigate({ to: '/m/home' })}
          style={{
            position: 'absolute',
            left: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#222',
            zIndex: 1,
          }}
        />
        <div
          style={{
            textAlign: 'center',
            fontWeight: 700,
            fontSize: 28,
            letterSpacing: 2,
            color: '#222',
          }}
        >
          簡介
        </div>
      </div>
      {/* Article Cards */}
      <div style={{ padding: '0 8px' }}>
        {mockArticles.map((a, idx) => (
          <Link
            key={a.id}
            to="/m/home/articles/$articleId"
            params={{ articleId: a.id }}
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#fff',
              borderRadius: 8,
              marginBottom: 16,
              boxShadow: '0 2px 8px #0001',
              textDecoration: 'none',
              padding: 12,
              minHeight: 90,
            }}
          >
            <ArticleItem
              title={a.title}
              image={a.img}
              date={a.overlay || ''}
              category={a.overlay || ''}
              link={a.id || ''}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
