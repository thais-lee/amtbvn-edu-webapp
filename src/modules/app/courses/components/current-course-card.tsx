// src/modules/app/courses/components/course-card.tsx
import { ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from '@tanstack/react-router';
import { Button, Card, Progress, Space, Tag, Typography } from 'antd';
// Import Progress
import dayjs from 'dayjs';

import useApp from '@/hooks/use-app';

import { TCourseDetail, TCourseEnrolled } from '../course.model';
import './course-card.css';

const { Title, Text } = Typography;

type TProps = {
  course: TCourseEnrolled;
  routePrefix?: 'm' | 'd';
};

export default function CurrentCourseCard({
  course,
  routePrefix = 'm',
}: TProps) {
  const navigate = useNavigate();
  const { t } = useApp();

  // Calculate progress (dummy value for now, replace with actual progress logic)
  const courseProgress = course.progressPercentage ?? 0; // Assuming 'progress' exists on TCourseEnrolled

  const handleCourseClick = (courseId: number) => {
    navigate({
      to: `/${routePrefix}/lecture-hall/course/$courseId`,
      params: { courseId: courseId.toString() },
    });
  };

  return (
    <Card
      hoverable
      className="course-card"
      onClick={() => handleCourseClick(course.course.id)} // Add onClick to the Card
      cover={
        <img
          src={course.course.imageFileUrl ?? '/assets/images/alt-image.jpg'}
          alt={course.course.name}
          style={{
            height: 220,
            objectFit: 'cover',
          }}
        />
      }
    >
      <Title level={5} style={{ marginBottom: '8px' }}>
        {course.course.name}
      </Title>

      <Space direction="vertical" style={{ width: '100%' }}>
        {/* Category */}
        <Tag color="blue" style={{ marginRight: 0 }}>
          {course.course.category.name}
        </Tag>

        {/* Last Accessed Date */}
        <Space>
          <ClockCircleOutlined />
          <Text type="secondary">
            {t('Last Accessed')}:{' '}
            {course.lastAccessedAt
              ? dayjs(course.lastAccessedAt).format('DD/MM/YYYY')
              : ''}
          </Text>
        </Space>

        {/* Enrolled Date */}
        <Space>
          <UserOutlined />
          <Text type="secondary">
            {t('Enrolled')}:{' '}
            {course.enrolledAt
              ? dayjs(course.enrolledAt).format('DD/MM/YYYY')
              : ''}
          </Text>
        </Space>

        {/* Progress Bar */}
        <div style={{ marginTop: '12px' }}>
          <Text strong>{t('Progress')}</Text>
          <Progress percent={courseProgress} status="active" />
        </div>
        <Button
          type="primary"
          onClick={() => handleCourseClick(course.course.id)}
        >
          {t('Go to Course')}
        </Button>
      </Space>
    </Card>
  );
}
