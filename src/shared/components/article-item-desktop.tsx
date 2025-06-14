import { useNavigate } from '@tanstack/react-router';
import Button from 'antd/es/button';
import Card from 'antd/es/card';
import Space from 'antd/es/space';
import Typography from 'antd/es/typography';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

export interface ArticleItemDesktopProps {
  title: string;
  summary?: string;
  date?: string | Date;
  image?: string;
  onClick?: () => void;
  actionText?: string;
  categoryId?: number;
  id?: number;
}
function ArticleItemDesktop({
  title,
  summary,
  date,
  image,
  onClick,
  actionText = 'Xem chi tiết',
  categoryId,
  id,
}: ArticleItemDesktopProps) {
  const navigate = useNavigate();
  return (
    <Card
      onClick={() => {
        if (onClick) {
          onClick();
        } else {
          navigate({ to: `/d/home/articles/${categoryId}/${id}` });
        }
      }}
      hoverable
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        minHeight: 120,
        marginBottom: 16,
        boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
        padding: 0,
      }}
      styles={{
        body: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          padding: 16,
        },
      }}
    >
      <img
        alt={title}
        src={image ? image : '/assets/images/alt-image.jpg'}
        style={{
          width: 140,
          height: 100,
          objectFit: 'cover',
          borderRadius: 8,
          marginRight: 24,
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1 }}>
        <Space direction="vertical" size={4} style={{ width: '100%' }}>
          <Title level={5} style={{ margin: 0 }}>
            {title}
          </Title>
          {summary && (
            <Paragraph ellipsis={{ rows: 2 }} style={{ margin: 0 }}>
              <div dangerouslySetInnerHTML={{ __html: summary }} />
            </Paragraph>
          )}
          {date && (
            <Text type="secondary" style={{ fontSize: 13 }}>
              {dayjs(date).format('DD/MM/YYYY')}
            </Text>
          )}
        </Space>
      </div>
      {onClick && (
        <Button type="link" onClick={onClick} style={{ marginLeft: 16 }}>
          {actionText}
        </Button>
      )}
    </Card>
  );
}

export default ArticleItemDesktop;
