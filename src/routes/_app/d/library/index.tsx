import { Link, createFileRoute } from '@tanstack/react-router';
import { Card, Typography } from 'antd';

import { PageHeader } from '@/shared/components/layouts/app/page-header';

import './styles.css';

interface CategoryCard {
  id: string;
  title: string;
  image: string;
  path: string;
}

const categories: CategoryCard[] = [
  {
    id: '/d/library/lectures',
    title: 'Bài Giảng',
    image: '/assets/images/bai-giang.png',
    path: '/lectures',
  },
  {
    id: '/d/library/podcasts',
    title: 'Podcast',
    image: '/assets/images/podcasts.jpg',
    path: '/podcasts',
  },
  // {
  //   id: '/d/library/talks',
  //   title: 'Khai Thị',
  //   image: '/assets/images/khai-thi.jpg',
  //   path: '/dharma',
  // },
  {
    id: '/d/library/images',
    title: 'Tranh Ảnh',
    image: '/assets/images/tranh-anh.jpg',
    path: '/gallery',
  },
  {
    id: '/d/library/books',
    title: 'Kinh Sách Tịnh Tông',
    image: '/assets/images/kinh-sach-tinh-tong.jpg',
    path: '/books',
  },
];

export const Route = createFileRoute('/_app/d/library/')({
  component: DLibraryComponent,
});

function DLibraryComponent() {
  return (
    <div className="library-screen">
      <PageHeader
        title="Thư Viện"
        subtitle="Khám phá kho tàng tri thức Phật pháp"
      />

      <div className="library-content">
        <div className="category-grid">
          {categories.map((category) => (
            <Link key={category.id} to={category.id} className="category-link">
              <Card
                className="category-card no-padding"
                hoverable
                cover={
                  <div className="category-image">
                    <img
                      src={category.image}
                      alt={category.title}
                      loading="lazy"
                    />
                  </div>
                }
              >
                <div className="category-overlay">
                  <Typography.Title level={3} className="category-title">
                    {category.title}
                  </Typography.Title>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
