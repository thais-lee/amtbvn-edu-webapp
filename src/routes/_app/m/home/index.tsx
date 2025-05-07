import { RightOutlined, SearchOutlined } from '@ant-design/icons';
import { createFileRoute } from '@tanstack/react-router';
import { Card, Carousel, ConfigProvider, List, Tabs, Typography } from 'antd';
import { useState } from 'react';

import ArticleItem from '@/shared/components/articleItem';
import SectionTitle from '@/shared/components/section-title';

import './styles.css';

export const Route = createFileRoute('/_app/m/home/')({
  component: MobileHomeScreen,
});

const { Title } = Typography;

const sliderImages = [
  {
    id: '1',
    image: '/assets/images/slider/banner1.jpg',
    title: 'Welcome to AMTBVN',
    description: 'Discover the path to enlightenment',
  },
  {
    id: '2',
    image: '/assets/images/slider/banner2.jpg',
    title: 'Pure Land Buddhism',
    description: 'Learn the teachings of Amitabha Buddha',
  },
  {
    id: '3',
    image: '/assets/images/slider/banner3.jpg',
    title: 'Dharma Talks',
    description: 'Listen to inspiring teachings',
  },
];

const categories = [
  { key: 'recommended', label: 'Đề xuất' },
  { key: 'buddhism-intro', label: 'Lão Pháp Sư' },
  { key: 'three-refuges', label: 'Tịnh Tông Học Hội' },
  { key: 'basic-sutras', label: 'Cương Lĩnh Tu Học' },
  { key: 'pure-land', label: 'Vấn đáp học Phật' },
];

// Mock data for articles
const pinnedArticles = [
  {
    id: '1',
    title: 'Giới thiệu về Tịnh Độ Tông',
    image: '/assets/images/articles/pinned1.jpg',
    date: '2024-04-27',
    category: 'Giới thiệu',
  },
  {
    id: '2',
    title: 'Phương pháp niệm Phật',
    image: '/assets/images/articles/pinned2.jpg',
    date: '2024-04-26',
    category: 'Phương pháp',
  },
];

const subjectArticles = [
  {
    id: '1',
    title: 'Phương pháp niệm Phật',
    image: '/assets/images/articles/subject1.jpg',
    date: '2024-04-26',
    category: 'Phương pháp',
  },
  {
    id: '2',
    title: 'Ý nghĩa của Tịnh Độ',
    image: '/assets/images/articles/subject2.jpg',
    date: '2024-04-25',
    category: 'Giáo lý',
  },
  {
    id: '3',
    title: 'Hành trì Tịnh Độ',
    image: '/assets/images/articles/subject3.jpg',
    date: '2024-04-24',
    category: 'Thực hành',
  },
];

const recentArticles = [
  {
    id: '1',
    title: 'Bài giảng mới nhất về Tịnh Độ',
    image: '/assets/images/articles/recent1.jpg',
    date: '2024-04-27',
    category: 'Bài giảng',
  },
  {
    id: '2',
    title: 'Khai thị về niệm Phật',
    image: '/assets/images/articles/recent2.jpg',
    date: '2024-04-26',
    category: 'Khai thị',
  },
  {
    id: '3',
    title: 'Vấn đáp về Tịnh Độ',
    image: '/assets/images/articles/recent3.jpg',
    date: '2024-04-25',
    category: 'Vấn đáp',
  },
];

function MobileHomeScreen() {
  const [activeTab, setActiveTab] = useState('recommended');

  const renderTabContent = (key: string) => {
    if (key === 'recommended') {
      return (
        <>
          <div className="slider-container">
            <Carousel autoplay dots={true} dotPosition="bottom" effect="fade">
              {sliderImages.map((slide) => (
                <div key={slide.id} className="slider-item">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="slider-image"
                  />
                  <div className="slider-content">
                    <Typography.Title level={3} className="slider-title">
                      {slide.title}
                    </Typography.Title>
                    <Typography.Text className="slider-description">
                      {slide.description}
                    </Typography.Text>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>

          {/* Pinned Articles Section */}
          <div
            style={{ backgroundColor: 'white', borderRadius: 10, padding: 10 }}
          >
            <SectionTitle title="Bài viết nổi bật" />
            <List
              itemLayout="vertical"
              size="default"
              dataSource={pinnedArticles}
              renderItem={(item) => (
                <List.Item>
                  <ArticleItem
                    title={item.title}
                    date={item.date}
                    category={item.category}
                    image={item.image}
                    link={`/articles/${item.id}`}
                    className="pinned-article-link"
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
              {subjectArticles.map((article) => (
                <a
                  key={article.id}
                  href={`/articles/${article.id}`}
                  className="subject-article-link"
                >
                  <Card className="subject-article-card">
                    <div className="subject-article-image">
                      <img src={article.image} alt={article.title} />
                    </div>
                    <div className="subject-article-content">
                      <div className="article-category">{article.category}</div>
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
          <div
            style={{ backgroundColor: 'white', borderRadius: 10, padding: 10 }}
          >
            <SectionTitle title="Bài viết mới nhất" />
            <List
              style={{
                backgroundColor: 'white',
                borderRadius: 10,
                padding: 10,
              }}
              itemLayout="vertical"
              size="default"
              dataSource={recentArticles}
              renderItem={(item) => (
                <List.Item>
                  <ArticleItem
                    title={item.title}
                    date={item.date}
                    category={item.category}
                    image={item.image}
                    link={`/articles/${item.id}`}
                    className="recent-article-link"
                  />
                </List.Item>
              )}
            />
          </div>
        </>
      );
    }
    return <div>Content for {key}</div>;
  };

  return (
    <div className="mobile-home-screen">
      <div className="home-header">
        <Title level={3} className="home-title">
          One-Learning
        </Title>
        <button className="search-button">
          <SearchOutlined className="search-icon" />
        </button>
      </div>

      <ConfigProvider
        theme={{
          components: {
            Tabs: {
              inkBarColor: '#8B4513',
              itemSelectedColor: '#8B4513',
              itemColor: '#666',
            },
          },
        }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={categories}
          className="category-tabs"
          tabBarGutter={24}
          size="large"
        />
      </ConfigProvider>

      {renderTabContent(activeTab)}
    </div>
  );
}

export default MobileHomeScreen;
