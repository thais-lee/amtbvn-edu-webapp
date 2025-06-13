import { RightOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Card, Carousel, List, Typography } from 'antd';
import Title from 'antd/es/skeleton/Title';
import dayjs from 'dayjs';

import useApp from '@/hooks/use-app';
import articleService from '@/modules/app/articles/article.service';

import ArticleItem from '../components/articleItem';
import SectionTitle from '../components/section-title';

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

const RecommendTab = () => {
  const { Title } = Typography;
  const { t } = useApp();
  const navigate = useNavigate();
  const { data: newestArticle } = useQuery({
    queryKey: ['newestArticle'],
    queryFn: () =>
      articleService.getArticles({
        take: 3,
        skip: 0,
      }),
    select: (data) => data.data.items,
  });

  const { data: pinnedArticles } = useQuery({
    queryKey: ['pinnedArticles'],
    queryFn: () =>
      articleService.getArticles({
        take: 3,
        skip: 0,
        categoryId: 42,
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

  return (
    <div style={{ background: '#f8f5ef', padding: 10 }}>
      <div className="slider-container">
        <Carousel autoplay dots={true} dotPosition="bottom" effect="fade">
          {sliderImages.map((slide) => (
            <div key={slide.id} className="slider-item">
              <img
                src={slide.image}
                alt={slide.id}
                className="slider-image"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          ))}
        </Carousel>
      </div>

      {/* Pinned Articles Section */}
      <div style={{ backgroundColor: 'white', borderRadius: 10, padding: 10 }}>
        <SectionTitle title={t('Thông báo')} />
        <List
          itemLayout="vertical"
          size="default"
          dataSource={pinnedArticles}
          renderItem={(item) => (
            <List.Item>
              <ArticleItem
                title={item.title}
                date={dayjs(item.createdAt).format('DD/MM/YYYY')}
                category={item.category?.name ?? ''}
                image={item.thumbnailUrl ?? ''}
                className="pinned-article-link"
                onClick={() => {
                  navigate({
                    to: '/m/home/articles/$categoryId/$articleId',
                    params: {
                      categoryId: item.categoryId.toString(),
                      articleId: item.id.toString(),
                    },
                  });
                }}
              />
            </List.Item>
          )}
        />
      </div>

      {/* Subject Articles Section */}
      <div className="section-container">
        <div className="section-header">
          <Title level={4} className="section-title">
            Chủ đề nổi bật
          </Title>
          <a href="/subjects" className="watch-more-link">
            Xem thêm <RightOutlined />
          </a>
        </div>
        <div className="subject-articles">
          {subjectArticles?.map((article) => (
            <a
              key={article.id}
              href={`/m/home/articles/${article.categoryId}/${article.id}`}
              className="subject-article-link"
            >
              <Card className="subject-article-card">
                <div className="subject-article-image">
                  <img
                    src={article.thumbnailUrl ?? '/assets/images/tranh-anh.jpg'}
                    alt={article.title}
                  />
                </div>
                <div className="subject-article-content">
                  <div className="article-category">
                    {article.category?.name ?? ''}
                  </div>
                  <Title level={5} className="article-title">
                    {article.title}
                  </Title>
                </div>
              </Card>
            </a>
          ))}
        </div>
      </div>

      {/* Recent Articles Section */}
      <div style={{ backgroundColor: 'white', borderRadius: 10, padding: 10 }}>
        <SectionTitle title="Bài viết mới nhất" />
        <List
          style={{
            backgroundColor: 'white',
            borderRadius: 10,
            padding: 10,
          }}
          itemLayout="vertical"
          size="default"
          dataSource={newestArticle}
          renderItem={(item) => (
            <List.Item>
              <ArticleItem
                title={item.title}
                date={dayjs(item.createdAt).format('DD/MM/YYYY')}
                category={item.category?.name ?? ''}
                image={item.thumbnailUrl ?? ''}
                className="recent-article-link"
                onClick={() => {
                  navigate({
                    to: '/m/home/articles/$categoryId/$articleId',
                    params: {
                      categoryId: item.categoryId.toString(),
                      articleId: item.id.toString(),
                    },
                  });
                }}
              />
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default RecommendTab;
