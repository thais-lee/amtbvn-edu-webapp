import { css } from '@emotion/react';
import {
  Outlet,
  createFileRoute,
  useNavigate,
  useRouter,
} from '@tanstack/react-router';
import { Layout } from 'antd';
import { useEffect } from 'react';

import useApp from '@/hooks/use-app';
import { useAuth } from '@/hooks/use-auth';
import useDeviceSize from '@/hooks/use-device-size';
import { useAuthStore } from '@/modules/auth/auth.zustand';
import BottomNavBar from '@/shared/components/layouts/app/bottom-nav-bar';

export const Route = createFileRoute('/_app')({
  component: AppLayout,
});

function AppLayout() {
  const navigate = useNavigate();
  const router = useRouter();

  const authQuery = useAuth();

  const { token, antdApp } = useApp();
  const { isMobile } = useDeviceSize();

  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (authQuery.isError) {
      navigate({
        to: '/auth/login',
        search: {
          from: router.history.location.pathname,
        },
      });
    }
  }, [authQuery.isError, navigate, router.history.location.pathname, user]);

  return (
    <Layout>
      <Layout.Content
        className="main-content"
        css={css`
          margin: ${isMobile ? 0 : token.margin}px;
          padding: ${isMobile ? 0 : token.padding}px;
          background-color: ${token.colorBgContainer};
          border-radius: ${token.borderRadius}px;
          height: calc(100dvh - 64px - 2 * ${token.margin}px);
          overflow-y: auto;
          overflow: -moz-scrollbars-none;
          -ms-overflow-style: none;
        `}
      >
        <Outlet />
        <BottomNavBar />
      </Layout.Content>
    </Layout>
  );
}
