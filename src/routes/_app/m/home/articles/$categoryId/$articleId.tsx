// src/routes/_app/m/home/articles/$categoryId/$articleId.tsx
import { LeftOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button, Spin, Typography } from 'antd';
import dayjs from 'dayjs';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

import { TArticle } from '@/modules/app/articles/article.model';
import articleService from '@/modules/app/articles/article.service';
import NoArticlesFound from '@/modules/app/articles/components/no-article-found';
import { TCategory } from '@/modules/app/categories/category.model';
import categoryService from '@/modules/app/categories/category.service';

// Import categoryService to get category name

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

  // Fetch article details
  const {
    data: articleData,
    isLoading: isArticleLoading,
    isError: isArticleError,
  } = useQuery<TArticle, Error, TArticle>({
    queryKey: ['article', articleId],
    queryFn: async () => {
      // Assuming articleService.getArticleById exists and returns TArticle
      const response = await articleService.getArticleById(parseInt(articleId));
      return response.data;
    },
    enabled: !!articleId,
  });

  // Fetch category details to get the category name for display
  const {
    data: categoryData,
    isLoading: isCategoryLoading,
    isError: isCategoryError,
  } = useQuery<any, Error, TCategory>({
    // Use any here as getManyCategories returns TPaginated<TCategory>
    queryKey: ['category', categoryId],
    queryFn: async () => {
      const response = await categoryService.getOne(parseInt(categoryId));
      return response.data;
    },
    enabled: !!categoryId && !isArticleLoading, // Only fetch category if article is loading (to show title) or article data is available
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
          // Removed backgroundColor to use the overall background color
          // Removed borderRadius and margin: '0 8px' for full width
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)', // Keep light shadow
          padding: '0 16px 16px', // Add horizontal padding for content
          backgroundColor: '#fff', // Set background to match the overall screen
        }}
      >
        {/* Title and image are now within the content area */}
        <Title
          level={4} // Changed to level 2 for consistency with the header
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

        <Text
          type="secondary"
          style={{ display: 'block', marginBottom: '16px' }}
        >
          {(categoryData?.name || articleData.categoryId) + ' | '}{' '}
          {/* Display category name or ID as fallback */}
          {dayjs(articleData.createdAt).format('DD/MM/YYYY')}
        </Text>
        <div
          // style={{ width: '100%', height: '100%', fontSize: 100 }}
          className="quill-content-container"
        >
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
        {/* The main title of the page is now dynamically set from articleData.title */}
        {/* <Title
          level={2}
          style={{
            textAlign: 'center',
            margin: 0,
            fontWeight: 800,
            fontSize: 28,
            letterSpacing: 1,
            color: '#222',
            flex: 1,
            zIndex: 1,
            userSelect: 'none',
          }}
        >
          {isArticleLoading
            ? 'Loading...'
            : articleData?.title || 'Article Detail'}
        </Title> */}
      </div>

      {/* Article Content */}
      {renderContent()}
    </div>
  );
}
