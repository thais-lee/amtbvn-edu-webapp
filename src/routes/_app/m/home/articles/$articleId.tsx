import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button, Typography } from 'antd';

export const Route = createFileRoute('/_app/m/home/articles/$articleId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { articleId } = Route.useParams() as { articleId: string };
  const navigate = useNavigate();

  return (
    <div style={{ background: '#fff', minHeight: '100vh', padding: '24px' }}>
      <Typography.Title
        level={2}
        style={{ textAlign: 'center', margin: '0 0 24px 0' }}
      >
        {`Bài viết ${articleId}`}
      </Typography.Title>
      <Button
        onClick={() => {
          window.history.back();
        }}
        style={{ marginBottom: 24 }}
      >
        Quay lại
      </Button>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        Nội dung bài viết...
      </div>
    </div>
  );
}
