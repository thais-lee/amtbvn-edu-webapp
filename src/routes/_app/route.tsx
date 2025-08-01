import { css } from '@emotion/react';
import {
  Outlet,
  createFileRoute,
  redirect,
  useNavigate,
  useRouter,
} from '@tanstack/react-router';
import { Layout, Spin } from 'antd';
import React, { Suspense, useEffect } from 'react';

import useApp from '@/hooks/use-app';
import { useAuth } from '@/hooks/use-auth';
import useDeviceSize from '@/hooks/use-device-size';
import { useAuthStore } from '@/modules/auth/auth.zustand';

const SharedAppLayout: React.FC = () => {
  const navigate = useNavigate();
  const router = useRouter();

  const authQuery = useAuth();
  const { token } = useApp();
  const { isMobile } = useDeviceSize();

  const user = useAuthStore((state) => state.user);

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
    <Suspense fallback={<Spin fullscreen />}>
      <Layout>
        <Layout.Content
          className="main-content"
          css={css`
            margin: ${isMobile ? 0 : 0}px;
            padding: ${isMobile ? 0 : 0}px;
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
    </Suspense>
  );
};

export const Route = createFileRoute('/_app')({
  component: SharedAppLayout,
  validateSearch: (search: Record<string, unknown>) => {
    return search;
  },
  beforeLoad: async () => {
    const accessToken = useAuthStore.getState().accessToken;
    if (!accessToken) {
      throw redirect({
        to: '/auth/login',
        search: {
          from: window.location.pathname,
        },
      });
    }
    return {};
  },
});

export const appRoute = Route;
