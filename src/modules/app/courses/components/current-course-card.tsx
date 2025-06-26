// src/modules/app/courses/components/course-card.tsx
import { ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from '@tanstack/react-router';
import { Button, Card, Progress, Space, Tag, Typography } from 'antd';
import dayjs from 'dayjs';

import useApp from '@/hooks/use-app';

import { TCourseEnrolled } from '../course.model';
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

  const totalLessons = course.course.lessons.length;
  const completedLessons = course.course.lessons.filter(
    (lesson) =>
      lesson.completions.length > 0 &&
      lesson.completions[0].isCompleted === true,
  );

  const progressPercentage = (completedLessons.length / totalLessons) * 100;

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

        {/* Last Updated Date */}
        <Space>
          <ClockCircleOutlined />
          <Text type="secondary">
            {t('Last updated')}:{' '}
            {course.course.updatedAt
              ? dayjs(course.course.updatedAt).format('HH:mm DD/MM/YYYY')
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
          <Progress percent={progressPercentage} status="active" />
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
