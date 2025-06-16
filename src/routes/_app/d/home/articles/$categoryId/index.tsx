import { ArrowLeftOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import {
  createFileRoute,
  useNavigate,
  useParams,
} from '@tanstack/react-router';
import { Button, List, Spin, Typography } from 'antd';

import articleService from '@/modules/app/articles/article.service';
import ArticleItemDesktop from '@/shared/components/article-item-desktop';

const { Title } = Typography;

export const Route = createFileRoute('/_app/d/home/articles/$categoryId/')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { categoryId } = useParams({ strict: false });

  const { data: articles, isLoading } = useQuery({
    queryKey: ['categoryArticles', categoryId],
    queryFn: () =>
      articleService.getArticles({ categoryId: Number(categoryId) }),
    select: (data) => data.data.items,
    enabled: !!categoryId,
  });

  if (isLoading) {
    return <Spin fullscreen tip="Đang tải danh sách bài viết..." />;
  }

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate({ to: '/d/home' })}
        style={{ marginBottom: 16 }}
      >
        Quay lại
      </Button>
      <Title level={2}>{articles?.[0]?.category?.name}</Title>
      <List
        itemLayout="vertical"
        dataSource={articles}
        renderItem={(article) => (
          <List.Item>
            <ArticleItemDesktop
              title={article.title}
              id={article.id}
              categoryId={article.categoryId}
              image={article.thumbnailUrl}
              summary={article.content}
              onClick={() => {
                navigate({
                  to: `/d/home/articles/${article.categoryId}/${article.id}`,
                });
              }}
            />
          </List.Item>
        )}
      />
    </div>
  );
}
