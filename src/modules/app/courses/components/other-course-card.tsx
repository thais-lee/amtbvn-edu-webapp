import { BookOutlined, UserOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Button, Card, Space, Tag, Typography, message } from 'antd';
import { useState } from 'react';

import useApp from '@/hooks/use-app';

import enrollmentService from '../../enrollments/enrollment.service';
import { TCourseItem } from '../course.model';
import './course-card.css';

const { Title, Text } = Typography;

type TProps = {
  course: TCourseItem;
  onEnrollSuccess?: (courseId: number, status: string) => void;
  routePrefix?: 'm' | 'd';
};

export default function OtherCourseCard({
  course,
  onEnrollSuccess,
  routePrefix = 'm',
}: TProps) {
  const navigate = useNavigate();
  const { t } = useApp();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const handleCourseClick = (courseId: number) => {
    navigate({
      to: `/${routePrefix}/lecture-hall/course/$courseId`,
      params: { courseId: courseId.toString() },
    });
  };

  const enrollMutation = useMutation({
    mutationFn: () => enrollmentService.enrollCourse(course.id),
    onSuccess: (data: any) => {
      const status = data?.data?.status;
      if (status === 'ACCEPTED') {
        message.success('Enrolled successfully');
        setIsEnrolled(true);
        onEnrollSuccess?.(course.id, 'current');
      } else if (status === 'PENDING') {
        message.info('Enrollment request submitted. Awaiting approval.');
        setIsEnrolled(true);
        onEnrollSuccess?.(course.id, 'pending');
      }
    },
    onError: () => {
      message.error('Failed to enroll in the course. Please try again.');
    },
  });

  const handleEnrollClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isEnrolled) return;
    enrollMutation.mutate();
  };

  return (
    <Card
      hoverable
      className="course-card"
      onClick={() => handleCourseClick(course.id)}
      cover={
        <img
          src={course.imageFileUrl ?? '/assets/images/alt-image.jpg'}
          alt={course.name}
          style={{
            height: 220,
            objectFit: 'cover',
          }}
        />
      }
      bodyStyle={{ padding: '16px' }}
    >
      <Title level={5} style={{ marginBottom: '8px' }}>
        {course.name}
      </Title>

      <Space
        direction="vertical"
        style={{ width: '100%', marginBottom: '12px' }}
      >
        <Tag color="blue" style={{ marginRight: 0 }}>
          {course.category.name}
        </Tag>

        <Space>
          <UserOutlined />
          <Text type="secondary">
            {t('Students')}: {course._count.enrollments ?? 0}
          </Text>
        </Space>

        <Space>
          <BookOutlined />
          <Text type="secondary">
            {t('Lessons')}: {course._count.lessons ?? 0}
          </Text>
        </Space>
      </Space>

      {isEnrolled ? (
        <Button type="default" disabled block>
          Enrolled - Pending Approval
        </Button>
      ) : (
        <Button
          type="primary"
          block
          onClick={handleEnrollClick}
          loading={enrollMutation.status === 'pending'}
        >
          {t('Enroll now')}
        </Button>
      )}
    </Card>
  );
}
