import { useMutation } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button } from 'antd';
import { useCallback } from 'react';

import authService from '@/modules/auth/auth.service';
import { useAuthStore } from '@/modules/auth/auth.zustand';

export const Route = createFileRoute('/_app/d/home/')({
  component: DHomeComponent,
});

function DHomeComponent() {
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
    <div>
      <Button type="primary" color="red" onClick={handleLogout}>
        Log out
      </Button>
    </div>
  );
}
