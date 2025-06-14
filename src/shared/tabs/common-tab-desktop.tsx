import { Card, List, Typography } from 'antd';

import ArticleItemDesktop from '@/shared/components/article-item-desktop';

const { Title } = Typography;

export interface CommonTabDesktopProps {
  categoryId: string;
  title: string;
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

function CommonTabDesktop({
  categoryId,
  title,
  articles,
  onArticleClick,
}: CommonTabDesktopProps) {
  return (
    <div>
      <Title level={3} style={{ marginBottom: 16 }}>
        {title}
      </Title>
      <Card
        title={
          <Title level={4} style={{ margin: 0 }}>
            Bài viết
          </Title>
        }
        style={{ marginBottom: 24 }}
      >
        <List
          dataSource={articles}
          renderItem={(item) => (
            <ArticleItemDesktop
              title={item.title}
              summary={item.content}
              date={item.createdAt}
              image={item.thumbnailUrl}
              categoryId={item.categoryId}
              id={item.id}
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

export default CommonTabDesktop;
