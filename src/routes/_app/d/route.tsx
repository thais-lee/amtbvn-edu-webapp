import { HomeOutlined, MenuOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Link, Outlet, createRoute } from '@tanstack/react-router';
import { Button, Layout, Spin } from 'antd';
import React, { Suspense, useState } from 'react';

import useApp from '@/hooks/use-app';
import MainSideNav from '@/shared/components/layouts/app/main-side-nav';
import MainTopBar from '@/shared/components/layouts/app/main-top-bar';

// Import drawer nav
import { appRoute } from '../route';

// Import layout cha (_app)

const DesktopLayoutComponent: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const showDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);
  const [collapsed, setCollapsed] = useState(false);

  const { t, token } = useApp();
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <MainSideNav collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout>
        <MainTopBar collapsed={collapsed} setCollapse={setCollapsed} />
        <Layout.Content
          className="main-content"
          css={css`
            margin: ${token.margin}px;
            padding: ${token.padding}px;
            background-color: ${token.colorBgContainer};
            border-radius: ${token.borderRadius}px;
            height: calc(100dvh - 64px - 2 * ${token.margin}px);
            overflow-y: auto;
            overflow: -moz-scrollbars-none;
            -ms-overflow-style: none;
          `}
        >
          <Outlet />
        </Layout.Content>
      </Layout>
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
