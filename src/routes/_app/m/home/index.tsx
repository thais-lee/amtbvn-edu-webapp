import { useMutation } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button, Layout } from 'antd';
import { useCallback } from 'react';

import authService from '@/modules/auth/auth.service';
import { useAuthStore } from '@/modules/auth/auth.zustand';
import BottomNavBar from '@/shared/components/layouts/app/bottom-nav-bar';

export const Route = createFileRoute('/_app/m/home/')({
  component: HomeScreen,
});

function HomeScreen() {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

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
    <Layout>
      <Button type="primary" color="red" onClick={handleLogout}>
        Log out
      </Button>
    </Layout>
  );
}
