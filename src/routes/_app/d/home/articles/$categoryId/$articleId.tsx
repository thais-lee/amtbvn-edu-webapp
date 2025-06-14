import { EyeOutlined, LikeOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createFileRoute,
  useNavigate,
  useParams,
} from '@tanstack/react-router';
import { Button, Card, Space, Spin, Tooltip, Typography } from 'antd';
import dayjs from 'dayjs';

import articleService from '@/modules/app/articles/article.service';

const { Title, Text, Paragraph } = Typography;

export const Route = createFileRoute(
  '/_app/d/home/articles/$categoryId/$articleId',
)({
  component: ArticleDetailDesktop,
});

function ArticleDetailDesktop() {
  const navigate = useNavigate();
  const params = useParams({ strict: false });
  const { categoryId, articleId } = params;
  const queryClient = useQueryClient();

  const {
    data: article,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['articleDetail', articleId],
    queryFn: () => articleService.getArticleById(Number(articleId)),
    select: (data) => data.data,
    enabled: !!articleId,
  });

  const likeMutation = useMutation({
    mutationFn: () => articleService.likeArticle(Number(articleId)),
    onSuccess: (newLikeCount) => {
      queryClient.setQueryData(['articleDetail', articleId], (old: any) =>
        old ? { ...old, likeCount: newLikeCount } : old,
      );
      refetch();
    },
  });

  if (isLoading) {
    return <Spin fullscreen tip="Đang tải bài viết..." />;
  }

  if (!article) {
    return <div>Không tìm thấy bài viết.</div>;
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <Button
        onClick={() => navigate({ to: `/d/home/articles/${categoryId}` })}
        style={{ marginBottom: 24 }}
      >
        Quay lại
      </Button>
      <Card
        style={{ borderRadius: 12 }}
        cover={
          article.thumbnailUrl && (
            <img
              src={article.thumbnailUrl}
              alt={article.title}
              style={{
                width: '100%',
                maxHeight: 340,
                objectFit: 'cover',
                borderRadius: 12,
              }}
            />
          )
        }
      >
        <Space
          align="center"
          style={{
            width: '100%',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <Title level={2} style={{ marginBottom: 0 }}>
            {article.title}
          </Title>
          <Space size={24}>
            <Space>
              <EyeOutlined />
              <Text>{article.viewCount ?? 0}</Text>
            </Space>
            <Space>
              <Tooltip title="Thích bài viết">
                <Button
                  type="text"
                  icon={
                    <LikeOutlined style={{ color: '#e25555', fontSize: 20 }} />
                  }
                  onClick={() => likeMutation.mutate()}
                  loading={likeMutation.status === 'pending'}
                  style={{ padding: 0 }}
                />
              </Tooltip>
              <Text>{article.likeCount ?? 0}</Text>
            </Space>
          </Space>
        </Space>
        <Text type="secondary" style={{ fontSize: 15 }}>
          {dayjs(article.createdAt).format('DD/MM/YYYY')}
        </Text>
        <Paragraph style={{ marginTop: 24 }}>
          <div dangerouslySetInnerHTML={{ __html: article.content || '' }} />
        </Paragraph>
      </Card>
    </div>
  );
}
