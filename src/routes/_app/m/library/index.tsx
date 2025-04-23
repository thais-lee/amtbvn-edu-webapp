import { createFileRoute } from '@tanstack/react-router';
import { Card, Typography } from 'antd';
import ScreenHeader from '@/shared/components/layouts/app/screen-header';

import './styles.css';

const { Title } = Typography;

interface CategoryCard {
  id: string;
  title: string;
  path: string;
  image: string;
}

const categories: CategoryCard[] = [
  {
    id: 'lectures',
    title: 'Bài Giảng',
    path: '/m/library/lectures',
    image: '/assets/images/bai-giang.png',
  },
  {
    id: 'podcasts',
    title: 'Podcast',
    path: '/m/library/podcasts',
    image: '/assets/images/podcasts.jpg',
  },
  {
    id: 'enlightenment',
    title: 'Khai Thị',
    path: '/m/library/enlightenment',
    image: '/assets/images/khai-thi.jpg',
  },
  {
    id: 'images',
    title: 'Tranh Ảnh',
    path: '/m/library/images',
    image: '/assets/images/tranh-anh.jpg',
  },
  {
    id: 'pureland-books',
    title: 'Kinh Sách Tịnh Tông',
    path: '/m/library/pureland-books',
    image: '/assets/images/kinh-sach-tinh-tong.jpg',
  },
];

export const Route = createFileRoute('/_app/m/library/')({
  component: LibraryScreen,
});

function LibraryScreen() {
  return (
    <div className="library-screen">
      <ScreenHeader title="Thư viện" />
      
      <div className="category-grid">
        {categories.map((category) => (
          <Card
            key={category.id}
            className="category-card"
            onClick={() => {
              // TODO: Navigate to category page
              console.log(`Navigate to ${category.path}`);
            }}
            bodyStyle={{ padding: 0 }}
          >
            <div className="category-image">
              <img src={category.image} alt={category.title} />
            </div>
            <div className="category-overlay">
              <Title level={5} className="category-title">
                {category.title}
              </Title>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
