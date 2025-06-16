import { useMutation } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  Avatar,
  Button,
  Card,
  List,
  Select,
  Space,
  Switch,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import { useCallback } from 'react';
import {
  IoBookOutline,
  IoLanguageOutline,
  IoLockClosedOutline,
  IoLogOutOutline,
  IoPencilOutline,
} from 'react-icons/io5';

import useApp from '@/hooks/use-app';
import authService from '@/modules/auth/auth.service';
import { useAuthStore } from '@/modules/auth/auth.zustand';
import ScreenHeader from '@/shared/components/layouts/app/screen-header';

import './styles.css';

const { Title, Text } = Typography;
const { Option } = Select;

export const Route = createFileRoute('/_app/m/profile/')({
  component: ProfileComponent,
});

const userData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: '/avatars/default.jpg',
  joinDate: '2024-01-01',
  currentCourses: [
    {
      id: '1',
      title: 'Thái Thượng Cảm Ứng Thiên',
      progress: 45,
      lastAccessed: '2024-03-20',
    },
  ],
};

function ProfileComponent() {
  const logout = useAuthStore((state) => state.logout);
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const { antdApp } = useApp();
  const { message } = antdApp;
  const handleEditProfile = () => {
    // TODO: Implement edit profile functionality
  };

  const handleChangePassword = () => {
    // TODO: Implement change password functionality
  };

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      logout();
      setUser(null);
      navigate({
        to: '/auth/login',
      });
    },
    onError: (error) => {
      setUser(null);
      message.error(error.message);
      navigate({
        to: '/auth/login',
      });
    },
  });

  const handleLogout = useCallback(() => {
    logoutMutation.mutate();
  }, [logoutMutation]);

  return (
    <div className="profile">
      <ScreenHeader title="Profile" />

      <div className="profile-content">
        <Card className="profile-card">
          <div className="profile-header">
            <Avatar size={80} src={user?.avatarImageFileUrl} />
            <div className="profile-info">
              <Title level={4}>
                {user?.lastName} {user?.firstName}
              </Title>
              <Text type="secondary">{user?.phoneNumber}</Text>
              <Text type="secondary">
                Thành viên từ {dayjs(user?.createdAt).format('DD/MM/YYYY')}
              </Text>
            </div>
            <Button
              type="primary"
              icon={<IoPencilOutline />}
              onClick={handleEditProfile}
            >
              Edit Profile
            </Button>
          </div>
        </Card>

        <Card className="settings-card">
          <Title level={5}>Settings</Title>
          <List>
            <List.Item>
              <Space>
                <IoLockClosedOutline />
                <Text>Change Password</Text>
              </Space>
              <Button type="link" onClick={handleChangePassword}>
                Change
              </Button>
            </List.Item>
            <List.Item>
              <Space>
                <IoLanguageOutline />
                <Text>Language</Text>
              </Space>
              <Select defaultValue="en" style={{ width: 120 }}>
                <Option value="en">English</Option>
                <Option value="zh">中文</Option>
                <Option value="vi">Tiếng Việt</Option>
              </Select>
            </List.Item>
            <List.Item>
              <Space>
                <IoBookOutline />
                <Text>Notifications</Text>
              </Space>
              <Switch defaultChecked />
            </List.Item>
          </List>
        </Card>

        <Card className="courses-card">
          <Title level={5}>Current Courses</Title>
          <List
            dataSource={userData.currentCourses}
            renderItem={(course) => (
              <List.Item>
                <div className="course-item">
                  <div className="course-info">
                    <Text strong>{course.title}</Text>
                    <Text type="secondary">Progress: {course.progress}%</Text>
                    <Text type="secondary">
                      Last accessed: {course.lastAccessed}
                    </Text>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              </List.Item>
            )}
          />
        </Card>

        <Button
          type="text"
          danger
          icon={<IoLogOutOutline />}
          onClick={handleLogout}
          className="logout-button"
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
