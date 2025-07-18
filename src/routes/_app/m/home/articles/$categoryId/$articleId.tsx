import Icon, { LeftOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button, FloatButton, Space, Spin, Typography } from 'antd';
import dayjs from 'dayjs';
import { PiEyeFill, PiHandsPrayingFill } from 'react-icons/pi';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

import { TArticle } from '@/modules/app/articles/article.model';
import articleService from '@/modules/app/articles/article.service';
import NoArticlesFound from '@/modules/app/articles/components/no-article-found';
import { TCategory } from '@/modules/app/categories/category.model';
import categoryService from '@/modules/app/categories/category.service';

const { Title, Text } = Typography;

export const Route = createFileRoute(
  '/_app/m/home/articles/$categoryId/$articleId',
)({
  component: ArticleDetailComponent,
});

function ArticleDetailComponent() {
  const { articleId, categoryId } = Route.useParams() as {
    articleId: string;
    categoryId: string;
  };
  const navigate = useNavigate();

  const {
    data: articleData,
    isLoading: isArticleLoading,
    isError: isArticleError,
    refetch: refetchArticle,
  } = useQuery<TArticle, Error, TArticle>({
    queryKey: ['article', articleId],
    queryFn: async () => {
      const response = await articleService.getArticleById(parseInt(articleId));
      return response.data;
    },
    enabled: !!articleId,
  });

  const { data: categoryData } = useQuery<any, Error, TCategory>({
    queryKey: ['category', categoryId],
    queryFn: async () => {
      const response = await categoryService.getOne(parseInt(categoryId));
      return response.data;
    },
    enabled: !!categoryId && !isArticleLoading,
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      const response = await articleService.likeArticle(parseInt(articleId));
      return response.data;
    },
    onSuccess: () => {
      refetchArticle();
    },
  });

  const renderContent = () => {
    if (isArticleLoading) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px 0',
          }}
        >
          <Spin size="large" />
        </div>
      );
    }

    if (isArticleError || !articleData) {
      return <NoArticlesFound />;
    }

    return (
      <div
        style={{
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          padding: '0 16px 16px',
          backgroundColor: '#fff',
        }}
      >
        <Title
          level={4}
          style={{
            marginBottom: '8px',
            textAlign: 'left',
            fontWeight: 800,
            color: '#222',
            padding: '16px 0',
          }}
        >
          {articleData.title}
        </Title>
        {articleData.thumbnailUrl && (
          <img
            src={articleData.thumbnailUrl}
            alt={articleData.title}
            style={{
              width: '100%',
              height: 200,
              objectFit: 'cover',
              borderRadius: '8px',
              marginBottom: '16px',
            }}
          />
        )}

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '4px 0px 16px 0px',
          }}
        >
          <Text
            type="secondary"
            style={{ display: 'block', fontSize: 14, color: '#a87332' }}
          >
            {(categoryData?.name || articleData.categoryId) + ' | '}{' '}
            {dayjs(articleData.createdAt).format('DD/MM/YYYY')}
          </Text>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div
              style={{
                backgroundColor: '#f8f5ef',
                padding: '4px 16px',
                borderRadius: 4,
                color: '#a87332',
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              <Icon
                component={PiEyeFill}
                style={{ fontSize: 16, color: '#a87332', marginRight: 4 }}
              />
              {articleData.viewCount}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                backgroundColor: '#f8f5ef',
                padding: '4px 16px',
                borderRadius: 4,
                color: '#a87332',
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              <Icon
                component={PiHandsPrayingFill}
                style={{ fontSize: 16, color: '#a87332', marginRight: 4 }}
              />
              {articleData.likeCount}
            </div>
          </div>
        </div>

        <div className="quill-content-container">
          <ReactQuill
            value={articleData.content}
            readOnly={true}
            theme="bubble"
            style={{ width: '100%', height: '100%' }}
            modules={{
              toolbar: false,
            }}
          />
          <style>{`
            .quill-content-container .ql-editor {
              font-size: 20px; /* Điều chỉnh font-size ở đây */
              line-height: 1.6;
            }
            /* Nếu muốn tiêu đề trong content cũng lớn hơn */
            .quill-content-container .ql-editor h1 {
              font-size: 2em;
            }
            .quill-content-container .ql-editor h2 {
              font-size: 1.5em;
            }
            .quill-content-container .ql-editor h3 {
              font-size: 1.17em;
            }
          `}</style>
        </div>

        {/* Button show view counts and like counts */}
        <Space
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            marginTop: 16,
            marginBottom: 16,
          }}
        >
          <FloatButton
            icon={
              <PiHandsPrayingFill
                style={{ color: '#a87332', fontSize: 20, marginRight: 4 }}
              />
            }
            //remove splash effect when click
            onClick={() => {
              likeMutation.mutate();
            }}
            style={{
              marginBottom: 50,
              backgroundColor: '#f8f5ef',
              color: '#a87332',
              border: '1px solid #a87332',
              // borderRadius: 4,
              // borderColor: '#a87332',
              // padding: '4px 16px',
              fontSize: 14,
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(45, 43, 43, 0.06)',
            }}
          >
            {articleData.likeCount}
          </FloatButton>
        </Space>
      </div>
    );
  };

  return (
    <div
      style={{
        background: '#f8f5ef',
        minHeight: '100%',
        width: '100%',
      }}
    >
      {/* Header Section */}
      <div
        style={{
          position: 'relative',
          background: '#fff',
          padding: '20px 0 18px 0',
          boxShadow: '0 4px 16px 0 rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 64,
        }}
      >
        <Button
          type="text"
          icon={<LeftOutlined style={{ fontSize: 24 }} />}
          onClick={() =>
            navigate({
              to: '/m/home/articles/$categoryId',
              params: { categoryId },
            })
          }
          style={{
            position: 'absolute',
            left: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#222',
            zIndex: 2,
            background: 'rgba(0,0,0,0.02)',
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        />
      </div>

      {/* Article Content */}
      {renderContent()}
    </div>
  );
}
