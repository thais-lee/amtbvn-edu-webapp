import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Button, Card, Empty, List } from 'antd';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';

import articleService from '@/modules/app/articles/article.service';

import ArticleItem from '../components/articleItem';

interface CommonTabProps {
  title: string;
  key?: string;
  category?: string;
  description?: string;
  image?: string;
  categoryId?: string;
}

const categories = [
  {
    title: 'Tất cả',
    key: 'all',
  },
  {
    title: 'Tin tức',
    key: 'news',
  },
  {
    title: 'Học tập',
    key: 'study',
  },
  {
    title: 'Tất cả',
    key: 'all1',
  },
  {
    title: 'Tin tức',
    key: 'news1',
  },
  {
    title: 'Học tập',
    key: 'study1',
  },
  {
    title: 'Tất cả',
    key: 'all2',
  },
  {
    title: 'Tin tức',
    key: 'news2',
  },
  {
    title: 'Học tập',
    key: 'study2',
  },
];

const articles1 = [
  {
    title: 'Tin tức 1',
    shortcut: 'Tin tức',
    image: 'https://via.placeholder.com/150',
    category: 'Tin tức',
    date: '2021-01-01',
    key: 'news1',
  },
  {
    title: 'Tin tức 2',
    shortcut: 'Tin tức',
    image: 'https://via.placeholder.com/150',
    category: 'Tin tức',
    date: '2021-01-01',
    key: 'news2',
  },
  {
    title: 'Tin tức 3',
    shortcut: 'Tin tức',
    image: 'https://via.placeholder.com/150',
    category: 'Tin tức',
    date: '2021-01-01',
    key: 'news3',
  },
  {
    title: 'Tin tức 4',
    shortcut: 'Tin tức',
    image: 'https://via.placeholder.com/150',
    category: 'Tin tức',
    date: '2021-01-01',
  },
];

const articles2 = [
  {
    title: 'Học tập 1',
    shortcut: 'Học tập',
    image: 'https://via.placeholder.com/150',
    category: 'Học tập',
    date: '2021-01-01',
    key: 'study1',
  },

  {
    title: 'Học tập 2',
    shortcut: 'Học tập',
    image: 'https://via.placeholder.com/150',
    category: 'Học tập',
    date: '2021-01-01',
    key: 'study2',
  },
  {
    title: 'Học tập 3',
    shortcut: 'Học tập',
    image: 'https://via.placeholder.com/150',
    category: 'Học tập',
    date: '2021-01-01',
    key: 'study3',
  },
  {
    title: 'Học tập 4',
    shortcut: 'Học tập',
    image: 'https://via.placeholder.com/150',
    category: 'Học tập',
    date: '2021-01-01',
    key: 'study4',
  },
];

const activeColor = '#9B856A';
const inactiveColor = '#fff';

const buttonListStyle: React.CSSProperties = {
  display: 'flex',
  overflowX: 'auto',
  padding: '0px 0',
  gap: '16px',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
};

const buttonStyle = (active: boolean): React.CSSProperties => ({
  background: active ? activeColor : inactiveColor,
  color: active ? '#fff' : '#222',
  border: 'none',
  borderRadius: 6,
  padding: '8px 24px',
  fontWeight: 'bold',
  fontSize: 16,
  cursor: 'pointer',
  transition: 'background 0.2s, color 0.2s',
  whiteSpace: 'nowrap',
  boxShadow: active ? '0 2px 8px rgba(155,133,106,0.08)' : 'none',
});

const CommonTab = ({ categoryId }: CommonTabProps) => {
  const [selected, setSelected] = useState(0);
  const navigate = useNavigate();

  const { data: articles, isLoading } = useQuery({
    queryKey: ['articles', categoryId],
    queryFn: () =>
      articleService.getArticles({ categoryId: parseInt(categoryId || '0') }),
  });

  return (
    <div>
      {/* <div style={buttonListStyle as React.CSSProperties as any}>
        {categories.map((item, idx) => (
          <Button
            key={item.key}
            style={buttonStyle(selected === idx)}
            onClick={() => setSelected(idx)}
          >
            {item.title}
          </Button>
        ))}
      </div> */}
      {/* Below: show list of articles, use ant design components if needed */}
      <div
        style={{
          marginTop: 16,
          backgroundColor: 'white',
          borderRadius: 10,
          padding: 10,
        }}
      >
        <List
          itemLayout="vertical"
          size="default"
          dataSource={articles?.data.items || []}
          renderItem={(item) => (
            <List.Item>
              <ArticleItem
                title={item.title}
                date={dayjs(item.createdAt).format('DD/MM/YYYY')}
                category={item.categoryId.toString()}
                image={item.thumbnailUrl || ''}
                onClick={() => {
                  navigate({
                    to: '/m/home/articles/$categoryId/$articleId',
                    params: {
                      categoryId: categoryId || '',
                      articleId: item.id.toString(),
                    },
                  });
                }}
              />
            </List.Item>
          )}
          locale={{
            emptyText: (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  width: '100%',
                }}
              >
                <Empty
                  description="Không có bài viết"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  style={{
                    width: '100%',
                    margin: 0,
                  }}
                />
              </div>
            ),
          }}
        />
      </div>
    </div>
  );
};

export default CommonTab;
