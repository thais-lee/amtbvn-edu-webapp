import { SearchOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Card, ConfigProvider, Tabs, Typography } from 'antd';
import { useCallback, useState } from 'react';

import authService from '@/modules/auth/auth.service';
import { useAuthStore } from '@/modules/auth/auth.zustand';

import './styles.css';

export const Route = createFileRoute('/_app/m/home/')({
  component: MobileHomeScreen,
});

const { Title } = Typography;

//label là tiếng việt

const categories = [
  { key: 'recommended', label: 'Đề xuất' },
  { key: 'buddhism-intro', label: 'Nhận thức Phật Giáo' },
  { key: 'three-refuges', label: 'Ba Ứng' },
  { key: 'basic-sutras', label: 'Các Kinh Điển Căn Bản' },
  { key: 'pure-land', label: 'Phật Giáo Cổ Điển' },
];

const lectures = [
  {
    id: '02-041',
    title: '二零一四淨土大經科註',
    image: '/lectures/02-041.jpg',
  },
  {
    id: '02-040',
    title: '二零一二淨土大經科註',
    image: '/lectures/02-040.jpg',
  },
  {
    id: '02-039',
    title: '淨土大經解演義',
    image: '/lectures/02-039.jpg',
  },
  {
    id: '02-037',
    title: '淨土大經科註',
    image: '/lectures/02-037.jpg',
  },
];

function MobileHomeScreen() {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const [activeTab, setActiveTab] = useState('recommended');

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      logout();
      navigate({
        to: '/auth/login',
      });
    },
    onError: () => {
      setUser(null);
      navigate({
        to: '/auth/login',
      });
    },
  });

  const handleLogout = useCallback(() => {
    logoutMutation.mutate();
  }, [logoutMutation]);

  return (
    <div className={``}>
      <div className="home-header">
        <Title level={3} className="home-title">
          講堂
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

      <div className="lecture-grid">
        {lectures.map((lecture) => (
          <Card
            key={lecture.id}
            cover={
              <div className="lecture-thumbnail">
                <img
                  src={lecture.image}
                  alt={lecture.title}
                  className="lecture-image"
                />
              </div>
            }
            className="lecture-card"
          >
            <Card.Meta
              title={<div className="lecture-title">{lecture.title}</div>}
              className="lecture-meta"
            />
          </Card>
        ))}
      </div>
      {/* <BottomNavBar /> */}
    </div>
  );
}

export default MobileHomeScreen;
