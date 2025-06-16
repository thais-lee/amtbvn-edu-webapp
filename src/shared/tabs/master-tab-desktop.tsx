import { useQuery } from '@tanstack/react-query';
import { Card, Col, List, Row, Typography } from 'antd';
import { useState } from 'react';

import articleService from '@/modules/app/articles/article.service';
import ArticleItemDesktop from '@/shared/components/article-item-desktop';

const { Title, Paragraph } = Typography;

export interface MasterTabDesktopProps {
  title: string;
  content?: string;
  cover?: string;
  articles: Array<{
    id: number;
    title: string;
    content?: string;
    createdAt?: string | Date;
    thumbnailUrl?: string;
    categoryId?: number;
  }>;
  onArticleClick?: (id: number, categoryId?: number) => void;
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

function MasterTabDesktop({ onArticleClick }: MasterTabDesktopProps) {
  const [activeTab, setActiveTab] = useState(37);

  const masterData = useQuery({
    queryKey: ['masterData', activeTab],
    queryFn: () =>
      articleService.getArticles({
        categoryId: activeTab,
      }),
    select: (data) => data.data.items,
    enabled: !!activeTab,
  });

  return (
    <div>
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        {tabContent.map((tab) => (
          <Col span={6} key={tab.id}>
            <Card
              hoverable
              onClick={() => setActiveTab(tab.id)}
              cover={
                <img
                  src={tab.cover}
                  alt={tab.title}
                  style={{
                    width: '100%',
                    height: 160,
                    objectFit: 'cover',
                    borderRadius: 8,
                  }}
                />
              }
              style={{
                borderRadius: 8,
                height: '100%',
                cursor: 'pointer',
                boxShadow:
                  activeTab === tab.id
                    ? '0 0 0 2px #8B4513, 0 1px 8px rgba(0,0,0,0.04)'
                    : '0 1px 8px rgba(0,0,0,0.04)',
                border:
                  activeTab === tab.id
                    ? '2px solid #8B4513'
                    : '1px solid #f0f0f0',
                transition: 'box-shadow 0.2s, border 0.2s',
              }}
            >
              <Title
                level={5}
                style={{
                  marginBottom: 8,
                  color: activeTab === tab.id ? '#8B4513' : undefined,
                }}
              >
                {tab.title}
              </Title>
              <Paragraph style={{ marginBottom: 0 }}>{tab.content}</Paragraph>
            </Card>
          </Col>
        ))}
      </Row>
      <Card
        title={
          <Title level={4} style={{ margin: 0 }}>
            Bài viết
          </Title>
        }
        style={{ marginBottom: 24 }}
      >
        <List
          dataSource={masterData.data}
          renderItem={(item) => (
            <ArticleItemDesktop
              title={item.title}
              summary={item.content}
              date={item.createdAt}
              image={item.thumbnailUrl}
              id={item.id}
              categoryId={item.categoryId}
              onClick={
                onArticleClick
                  ? () => onArticleClick(item.id, item.categoryId)
                  : undefined
              }
              actionText="Xem chi tiết"
            />
          )}
        />
      </Card>
    </div>
  );
}

export default MasterTabDesktop;
