import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  Card,
  Carousel,
  Col,
  ConfigProvider,
  List,
  Row,
  Tabs,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';

import useApp from '@/hooks/use-app';
import articleService from '@/modules/app/articles/article.service';
import ArticleItemDesktop from '@/shared/components/article-item-desktop';
import CommonTabDesktop from '@/shared/tabs/common-tab-desktop';
import MasterTabDesktop from '@/shared/tabs/master-tab-desktop';

const { Title, Text } = Typography;

const categories = [
  { key: 'recommended', label: 'Đề xuất' },
  { key: 'master-content', label: 'Lão Pháp Sư', id: 33 },
  { key: 'pure-land', label: 'Tịnh Tông Học Hội', id: 34 },
  { key: 'basic-sutras', label: 'Cương Lĩnh Tu Học', id: 35 },
  { key: 'question-answer', label: 'Vấn đáp học Phật', id: 36 },
];

const sliderImages = [
  {
    id: '1',
    image: '/assets/images/slider/banner1.jpg',
  },
  {
    id: '2',
    image: '/assets/images/slider/banner2.jpg',
  },
  {
    id: '3',
    image: '/assets/images/slider/banner3.jpg',
  },
];

export const Route = createFileRoute('/_app/d/home/')({
  component: DHomeComponent,
});

function DHomeComponent() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('recommended');
  const { t } = useApp();

  const { data: newestArticle } = useQuery({
    queryKey: ['newestArticle'],
    queryFn: () =>
      articleService.getArticles({
        take: 3,
        skip: 0,
      }),
    select: (data) => data.data.items,
  });

  const { data: subjectArticles } = useQuery({
    queryKey: ['subjectArticles'],
    queryFn: () =>
      articleService.getArticles({
        take: 3,
        skip: 0,
        categoryId: 50,
      }),
    select: (data) => data.data.items,
  });

  const announcementQuery = useQuery({
    queryKey: ['pinnedArticles'],
    queryFn: () =>
      articleService.getArticles({
        take: 3,
        skip: 0,
        categoryId: 42,
      }),
    select: (data) => data.data.items,
  });

  // Always call this hook, regardless of tab
  const category = categories.find((c) => c.key === activeTab);
  const { data: categoryArticles = [] } = useQuery({
    queryKey: ['categoryArticles', category?.id],
    queryFn: () =>
      articleService.getArticles({
        take: 10,
        skip: 0,
        categoryId: category?.id,
      }),
    select: (data) => data.data.items,
    enabled: !!category?.id && activeTab !== 'recommended',
  });

  // Desktop-optimized tab content
  const renderTabContent = (key: string, articles: any[]) => {
    if (key === 'recommended') {
      return (
        <div>
          {/* Banner/Slider */}
          <Carousel autoplay dots={true} dotPosition="bottom" effect="fade">
            {sliderImages.map((slide) => (
              <div key={slide.id}>
                <img
                  src={slide.image}
                  alt={slide.id}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: 8,
                  }}
                />
              </div>
            ))}
          </Carousel>
          {/* Announcements */}
          <Card
            title={
              <Title level={4} style={{ margin: 0 }}>
                {t('Announcement')}
              </Title>
            }
            style={{ marginBottom: 24 }}
          >
            <List
              dataSource={announcementQuery?.data?.slice(0, 2)}
              renderItem={(item) => (
                <ArticleItemDesktop
                  title={item.title}
                  summary={item.content}
                  date={item.createdAt}
                  image={item.thumbnailUrl}
                  id={item.id}
                  categoryId={item.categoryId}
                  onClick={() => {
                    navigate({
                      to: `/d/home/articles/${item.categoryId}/${item.id}`,
                    });
                  }}
                  actionText="Xem chi tiết"
                />
              )}
            />
          </Card>

          {/* Featured Topics */}

          <Title level={4} style={{ margin: '24px 0 12px' }}>
            {t('Chủ đề nổi bật')}
          </Title>
          <Row gutter={[24, 24]}>
            {subjectArticles?.map((article) => (
              <Col span={6} key={article.id}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={article.title}
                      src={article.thumbnailUrl}
                      style={{ height: 140, objectFit: 'cover' }}
                    />
                  }
                  style={{ borderRadius: 8 }}
                  onClick={() => {
                    navigate({
                      to: `/d/home/articles/${article.categoryId}/${article.id}`,
                    });
                  }}
                >
                  <div>
                    <Title level={5} style={{ margin: 0 }}>
                      {article.title}
                    </Title>
                    <Text type="secondary">
                      {dayjs(article.createdAt).format('DD/MM/YYYY')}
                    </Text>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Newest Articles */}
          <Card
            title={
              <Title level={4} style={{ margin: 0 }}>
                {t('Bài viết mới nhất')}
              </Title>
            }
            style={{ marginBottom: 24, marginTop: 16 }}
          >
            <List
              dataSource={newestArticle}
              renderItem={(item) => (
                <ArticleItemDesktop
                  title={item.title}
                  summary={item.content}
                  date={item.createdAt}
                  image={item.thumbnailUrl}
                  id={item.id}
                  categoryId={item.categoryId}
                  onClick={() => {
                    navigate({
                      to: `/d/home/articles/${item.categoryId}/${item.id}`,
                    });
                  }}
                  actionText="Xem chi tiết"
                />
              )}
            />
          </Card>
        </div>
      );
    }

    if (key === 'master-content') {
      return (
        <MasterTabDesktop title={category?.label || ''} articles={articles} />
      );
    }

    return (
      <CommonTabDesktop
        categoryId={category?.id?.toString() || ''}
        title={category?.label || ''}
        articles={articles}
        onArticleClick={(id, categoryId) => {
          navigate({ to: `/d/home/articles/${categoryId}/${id}` });
        }}
      />
    );
  };

  return (
    <div
      style={{
        padding: '0 16px 16px 16px',
        maxWidth: 1440,
        margin: 0,
        minHeight: 'calc(100vh - 64px)',
      }}
    >
      <ConfigProvider
        theme={{
          components: {
            Tabs: {
              inkBarColor: '#8B4513',
              itemSelectedColor: '#8B4513',
              itemColor: '#666',
              horizontalItemGutter: 16,
              horizontalMargin: '0 0 0 0',
              horizontalItemPadding: '8px 0',
              cardPadding: '0',
            },
          },
        }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={categories.map((c) => ({
            key: c.key,
            label: c.label,
          }))}
          tabBarGutter={16}
          size="large"
          style={{ marginBottom: 16 }}
        />
      </ConfigProvider>
      <div style={{ marginTop: 8 }}>
        {renderTabContent(activeTab, categoryArticles)}
      </div>
    </div>
  );
}

export default DHomeComponent;
