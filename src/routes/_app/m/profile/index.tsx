import { Card, Button, Typography, Avatar, Space, List, Divider, Switch, Select } from 'antd';
import { createFileRoute } from '@tanstack/react-router';
import ScreenHeader from '@/shared/components/layouts/app/screen-header';
import { IoPersonOutline, IoLockClosedOutline, IoLanguageOutline, IoBookOutline, IoLogOutOutline, IoPencilOutline } from 'react-icons/io5';

import './styles.css';

const { Title, Text } = Typography;
const { Option } = Select;

export const Route = createFileRoute('/_app/m/profile/')({
  component: ProfileComponent,
});

// Mock data - replace with actual data from your API
const userData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: '/avatars/default.jpg',
  joinDate: '2024-01-01',
  currentCourses: [
    {
      id: '1',
      title: '淨土大經科註',
      progress: 45,
      lastAccessed: '2024-03-20',
    },
    {
      id: '2',
      title: '二零一四淨土大經科註',
      progress: 30,
      lastAccessed: '2024-03-19',
    },
  ],
};

function ProfileComponent() {
  const handleEditProfile = () => {
    // TODO: Implement edit profile functionality
  };

  const handleChangePassword = () => {
    // TODO: Implement change password functionality
  };

  const handleLogout = () => {
    // TODO: Implement logout functionality
  };

  const handleLanguageChange = (value: string) => {
    // TODO: Implement language change functionality
  };

  const handleNotificationToggle = (checked: boolean) => {
    // TODO: Implement notification toggle functionality
  };

  return (
    <div className="profile">
      <ScreenHeader title="Profile" />
      
      <div className="profile-content">
        <Card className="profile-card">
          <div className="profile-header">
            <Avatar size={80} src={userData.avatar} />
            <div className="profile-info">
              <Title level={4}>{userData.name}</Title>
              <Text type="secondary">{userData.email}</Text>
              <Text type="secondary">Member since {userData.joinDate}</Text>
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
              <Button type="link" onClick={handleChangePassword}>Change</Button>
            </List.Item>
            <List.Item>
              <Space>
                <IoLanguageOutline />
                <Text>Language</Text>
              </Space>
              <Select defaultValue="en" style={{ width: 120 }} onChange={handleLanguageChange}>
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
              <Switch defaultChecked onChange={handleNotificationToggle} />
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
                    <Text type="secondary">Last accessed: {course.lastAccessed}</Text>
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
