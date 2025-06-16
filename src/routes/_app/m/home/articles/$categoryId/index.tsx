import { LeftOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button, Spin, Typography } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import { TArticle } from '@/modules/app/articles/article.model';
import articleService from '@/modules/app/articles/article.service';
import NoArticlesFound from '@/modules/app/articles/components/no-article-found';
import { TCategory } from '@/modules/app/categories/category.model';
import categoryService from '@/modules/app/categories/category.service';
import ArticleItem from '@/shared/components/articleItem';
import { TPaginated } from '@/shared/types/paginated.type';

const { Title } = Typography;

export const Route = createFileRoute('/_app/m/home/articles/$categoryId/')({
  component: CategoryArticleListPage,
});

function CategoryArticleListPage() {
  const { categoryId } = Route.useParams() as { categoryId: string };
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState('Loading...');

  // Fetch category details to get the category name
  const {
    data: categoryData,
    isLoading: isCategoryLoading,
    isError: isCategoryError,
  } = useQuery<TCategory, Error, TCategory>({
    queryKey: ['category', categoryId],
    queryFn: async () => {
      const response = await categoryService.getOne(parseInt(categoryId));
      return response.data;
    },
    enabled: !!categoryId, // Only run the query if categoryId is available
  });

  const handleGoBack = () => {
    navigate({
      to: '/m/home',
    });
  };

  const { data: articlesData, isLoading: isArticlesLoading } = useQuery<
    TPaginated<TArticle>,
    Error,
    TPaginated<TArticle>
  >({
    queryKey: ['articles', categoryId],
    queryFn: async () => {
      const response = await articleService.getArticles({
        categoryId: parseInt(categoryId),
        order: 'ASC',
      });
      return response.data;
    },
    enabled: !!categoryId,
  });

  useEffect(() => {
    if (categoryData) {
      setCategoryName(categoryData.name);
    } else if (isCategoryError) {
      setCategoryName('Error loading category');
    }
  }, [categoryData, isCategoryError]);

  const renderContent = () => {
    if (isArticlesLoading) {
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

    if (!articlesData?.items.length) {
      return <NoArticlesFound />;
    }

    return (
      <div style={{ padding: '0 8px' }}>
        {articlesData.items.map((article) => (
          <div
            key={article.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#fff',
              borderRadius: 8,
              marginBottom: 16,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              textDecoration: 'none',
              padding: 12,
              minHeight: 90,
            }}
          >
            <ArticleItem
              title={article.title}
              image={
                article.thumbnailUrl
                  ? article.thumbnailUrl
                  : '/assets/images/tranh-anh.jpg'
              }
              date={dayjs(article.createdAt).format('DD/MM/YYYY')}
              category={categoryData?.name || ''}
              onClick={() => {
                navigate({
                  to: '/m/home/articles/$categoryId/$articleId',
                  params: { categoryId, articleId: article.id.toString() },
                });
              }}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      style={{
        background: '#f8f5ef',
        minHeight: '100vh',
        paddingBottom: 16,
        width: '100%',
      }}
    >
      {/* Header Section */}
      <div
        style={{
          position: 'relative',
          background: '#fff',
          padding: '20px 0 18px 0',
          marginBottom: 24,
          // borderRadius: '0 0 18px 18px',
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
          onClick={handleGoBack}
          style={{
            position: 'absolute',
            left: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#222',
            zIndex: 2,
            background: 'rgba(0,0,0,0.02)',
            // borderRadius: '50%',
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        />
        <Title
          level={1}
          style={{
            textAlign: 'center',
            margin: 0,
            fontWeight: 800,
            fontSize: 21,
            letterSpacing: 1,
            color: '#222',
            flex: 1,
            zIndex: 1,
            userSelect: 'none',
          }}
        >
          {isCategoryLoading ? 'Loading...' : categoryName}
        </Title>
      </div>

      {/* Article List Section */}
      {renderContent()}
    </div>
  );
}
