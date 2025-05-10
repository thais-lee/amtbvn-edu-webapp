import { HomeOutlined, MenuOutlined } from '@ant-design/icons';
import { Link, Outlet, createRoute } from '@tanstack/react-router';
import { Button, Layout, Spin } from 'antd';
import React, { Suspense, useState } from 'react';

import { DesktopDrawerNav } from '@/shared/components/layouts/app/desktop-drawer-nav';

// Import drawer nav
import { appRoute } from '../route';

// Import layout cha (_app)

const { Header, Content } = Layout;

const DesktopLayoutComponent: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const showDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          background: '#fff',
          padding: '0 24px',
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={showDrawer}
          style={{ marginRight: '16px' }}
        />
        <Link
          to="/d/home"
          style={{
            color: 'inherit',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <HomeOutlined style={{ marginRight: '8px', fontSize: '20px' }} />
          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>
            OLS (Desktop)
          </span>
        </Link>
        {/* Thêm User menu, etc. */}
        <div style={{ flexGrow: 1 }}></div> {/* Spacer */}
        {/* User Profile Dropdown? */}
      </Header>
      <DesktopDrawerNav open={drawerOpen} onClose={closeDrawer} />
      <Content style={{ padding: '24px 48px', background: '#f0f2f5' }}>
        <Suspense
          fallback={
            <div style={{ textAlign: 'center', marginTop: 50 }}>
              <Spin />
            </div>
          }
        >
          <Outlet /> {/* Render các trang con trong thư mục d/ */}
        </Suspense>
      </Content>
      {/* Optional Footer */}
    </Layout>
  );
};

export const Route = createRoute({
  getParentRoute: () => appRoute, // Cha là _app
  path: 'd', // Phân đoạn path là /d
  component: DesktopLayoutComponent,
});

// Export để các route con trong d/ tham chiếu
export const desktopLayoutRoute = Route;
