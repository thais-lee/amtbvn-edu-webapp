import { Outlet, createFileRoute } from '@tanstack/react-router';
import { Layout, Spin } from 'antd';
import React, { Suspense } from 'react';

import BottomNavBar from '@/shared/components/layouts/app/bottom-nav-bar';

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
          <Outlet />
        </Suspense>
      </Content>
      <BottomNavBar />
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
