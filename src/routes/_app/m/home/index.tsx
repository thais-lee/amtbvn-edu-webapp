import { SearchOutlined } from '@ant-design/icons';
import { createFileRoute } from '@tanstack/react-router';
import { ConfigProvider, Tabs, Typography } from 'antd';
import { useState } from 'react';

import CommonTab from '@/shared/tabs/common.tab';
import MasterContent from '@/shared/tabs/master.tab';
import RecommendTab from '@/shared/tabs/recommend.tab';

import './styles.css';

export const Route = createFileRoute('/_app/m/home/')({
  component: MobileHomeScreen,
});

const { Title } = Typography;

const categories = [
  { key: 'recommended', label: 'Đề xuất' },
  { key: 'master-content', label: 'Lão Pháp Sư' },
  { key: 'pure-land', label: 'Tịnh Tông Học Hội' },
  { key: 'basic-sutras', label: 'Cương Lĩnh Tu Học' },
  { key: 'question-answer', label: 'Vấn đáp học Phật' },
];

function MobileHomeScreen() {
  const [activeTab, setActiveTab] = useState('recommended');

  const renderTabContent = (key: string) => {
    if (key === 'recommended') {
      return <RecommendTab />;
    }
    if (key === 'master-content') {
      return (
        <MasterContent
          title="Lão Pháp Sư"
          content="Lão Pháp Sư"
          cover="https://placehold.co/600x400"
        />
      );
    }
    return <CommonTab />;
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
