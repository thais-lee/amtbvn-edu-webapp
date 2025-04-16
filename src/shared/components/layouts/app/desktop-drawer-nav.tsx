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
          to="/m/home"
          onClick={onClose}
          activeProps={{ style: { fontWeight: 'bold' } }}
        >
          Trang chủ
        </Link>
      ),
    },
    {
      key: 'lectureHall',
      icon: <BookOutlined />,
      label: (
        <Link
          to="/m/lectureHall"
          onClick={onClose}
          activeProps={{ style: { fontWeight: 'bold' } }}
        >
          Khóa học
        </Link>
      ), // Example route
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: (
        <Link
          to="/profile"
          onClick={onClose}
          activeProps={{ style: { fontWeight: 'bold' } }}
        >
          Hồ sơ
        </Link>
      ), // Example route
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: (
        <Link
          to="/m/settings"
          onClick={onClose}
          activeProps={{ style: { fontWeight: 'bold' } }}
        >
          Cài đặt
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
