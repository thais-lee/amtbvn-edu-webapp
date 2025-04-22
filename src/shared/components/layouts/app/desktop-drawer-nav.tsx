import {
  BookOutlined,
  HomeOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
// Example icons
import { Link, useRouterState } from '@tanstack/react-router';
import { Drawer, Menu, MenuProps } from 'antd';
import React from 'react';

import useApp from '@/hooks/use-app';

// Use TanStack Link & hook

interface DesktopDrawerNavProps {
  open: boolean;
  onClose: () => void;
}

export const DesktopDrawerNav: React.FC<DesktopDrawerNavProps> = ({
  open,
  onClose,
}) => {
  const routerState = useRouterState();
  const { t } = useApp();
  // Helper to determine active key based on the start of the path
  const getActiveKey = () => {
    const pathname = routerState.location.pathname;
    if (pathname.startsWith('/profile')) return 'profile';
    if (pathname.startsWith('/m/lectureHall')) return 'lectureHall';
    if (pathname.startsWith('/m/settings')) return 'settings';
    if (pathname.startsWith('/m/home')) return 'home';
    return 'home'; // Default
  };

  const items: MenuProps['items'] = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      // Use Link component for client-side routing, call onClose when clicked
      label: (
        <Link
          to="/d/home"
          onClick={onClose}
          activeProps={{ style: { fontWeight: 'bold' } }}
        >
          {t('Home')}
        </Link>
      ),
    },
    {
      key: 'library',
      icon: <BookOutlined />,
      label: (
        <Link
          to="/d/library"
          onClick={onClose}
          activeProps={{ style: { fontWeight: 'bold' } }}
        >
          {t('BottomNavBar.Library')}
        </Link>
      ),
    },
    {
      key: 'lectureHall',
      icon: <BookOutlined />,
      label: (
        <Link
          to="/d/lecture-hall"
          onClick={onClose}
          activeProps={{ style: { fontWeight: 'bold' } }}
        >
          {t('BottomNavBar.LectureHall')}
        </Link>
      ), // Example route
    },
    {
      key: 'notifications',
      icon: <SettingOutlined />,
      label: (
        <Link
          to="/d/notifications"
          onClick={onClose}
          activeProps={{ style: { fontWeight: 'bold' } }}
        >
          {t('BottomNavBar.Notification')}
        </Link>
      ), // Example route
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: (
        <Link
          to="/d/profile"
          onClick={onClose}
          activeProps={{ style: { fontWeight: 'bold' } }}
        >
          {t('BottomNavBar.Profile')}
        </Link>
      ), // Example route
    },

    // Add other navigation items here
  ];

  return (
    <Drawer
      title="Menu"
      placement="left"
      onClose={onClose}
      open={open}
      styles={{ body: { padding: 0 } }}
    >
      <Menu
        mode="inline"
        selectedKeys={[getActiveKey()]}
        items={items}
        style={{ borderRight: 0 }}
      />
    </Drawer>
  );
};
