import { Outlet, createFileRoute } from '@tanstack/react-router';
import { Layout, Spin } from 'antd';
import React, { Suspense } from 'react';

import BottomNavBar from '@/shared/components/layouts/app/bottom-nav-bar';

// Import nav bar
import { appRoute } from '../route';

// Import layout cha (_app)

const { Content } = Layout;

const MobileLayoutComponent: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh', background: '#f8f2ed' }}>
      <Content style={{ padding: '0px', paddingBottom: '70px' }}>
        <Suspense
          fallback={
            <div style={{ textAlign: 'center', marginTop: 50 }}>
              <Spin />
            </div>
          }
        >
          <Outlet /> {/* Render các trang con trong thư mục m/ */}
        </Suspense>
      </Content>
      <BottomNavBar /> {/* Thanh điều hướng dưới */}
    </Layout>
  );
};

export const Route = createFileRoute('/_app/m')({
  component: MobileLayoutComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return search;
  },
  beforeLoad: () => {
    return {};
  },
});
