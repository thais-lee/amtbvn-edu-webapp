// src/modules/app/courses/components/course-card.tsx
import { BookOutlined, UserOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Button, Card, Space, Tag, Typography } from 'antd';
import { useState } from 'react';

import useApp from '@/hooks/use-app';
import { EEnrollmentStatus } from '@/modules/app/enrollments/enrollment.model';
import enrollmentService from '@/modules/app/enrollments/enrollment.service';

import { TCourseItem } from '../course.model';
import './course-card.css';

const { Title, Text } = Typography;

type TProps = {
  course: TCourseItem;
  onEnrollSuccess?: (courseId: number, status: string) => void; // Optional callback for successful enrollment
  routePrefix?: 'm' | 'd';
};

export default function PendingCourseCard({ course, onEnrollSuccess }: TProps) {
  const { t, antdApp } = useApp(); // Access translation function
  const { message } = antdApp;
  const [isEnrolled, setIsEnrolled] = useState(false); // State to track enrollment status

  const reEnrollMutation = useMutation({
    mutationFn: () => enrollmentService.reEnrollCourse(course.id),
    onSuccess: (data: any) => {
      const status = data?.data?.status;
      if (status === 'ACCEPTED') {
        message.success(t('Enrolled successfully'));
        setIsEnrolled(true);
        onEnrollSuccess?.(course.id, 'current');
      } else if (status === 'PENDING') {
        message.info(t('Enrollment request submitted. Awaiting approval.'));
        setIsEnrolled(true);
        onEnrollSuccess?.(course.id, 'pending');
      }
    },
    onError: () => {
      message.error(t('An error occurred'));
    },
  });

  const handleEnrollClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isEnrolled) return;
    reEnrollMutation.mutate();
  };

  const cancelMutation = useMutation({
    mutationFn: () =>
      enrollmentService.deleteEnrollment({ courseId: course.id }),
    onSuccess: () => {
      message.success(t('Deleted successfully'));
      setIsEnrolled(false);
      onEnrollSuccess?.(course.id, 'other');
    },
    onError: () => {
      message.error(t('An error occurred'));
    },
  });

  const renderEnrollmentButton = () => {
    switch (course.enrollments[0]?.status) {
      case EEnrollmentStatus.PENDING:
        return (
          <Button
            type="default"
            danger
            block
            onClick={(e) => {
              e.stopPropagation();
              cancelMutation.mutate();
            }}
            loading={cancelMutation.status === 'pending'}
          >
            {t('Cancel')}
          </Button>
        );
      case EEnrollmentStatus.REJECTED:
        return (
          <Button
            type="primary"
            block
            onClick={(e) => {
              e.stopPropagation();
              handleEnrollClick(e);
            }}
            loading={reEnrollMutation.status === 'pending'}
          >
            {t('Re-enroll')}
          </Button>
        );
      default:
        return (
          <Button
            type="primary"
            block
            onClick={handleEnrollClick}
            loading={reEnrollMutation.status === 'pending'}
          >
            {t('Enroll now')}
          </Button>
        );
    }
  };

  return (
    <Card
      className="course-card"
      hoverable
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
      styles={{ body: { padding: '16px' } }}
    >
      <Title level={5} style={{ marginBottom: '8px' }}>
        {course.name}
      </Title>

      <Space
        direction="vertical"
        style={{ width: '100%', marginBottom: '12px' }}
      >
        {/* Category */}
        <Tag color="blue" style={{ marginRight: 0 }}>
          {course.category?.name}
        </Tag>

        {/* Number of Students */}
        <Space>
          <UserOutlined />
          <Text type="secondary">
            {t('Students')}: {course._count.enrollments ?? 0}
          </Text>
        </Space>

        {/* Number of Lessons */}
        <Space>
          <BookOutlined />
          <Text type="secondary">
            {t('Lessons')}: {course._count.lessons ?? 0}
          </Text>
        </Space>

        {course.enrollments[0]?.status === EEnrollmentStatus.REJECTED && (
          <Tag color="error">{t('Rejected')}</Tag>
        )}

        {course.enrollments[0]?.status === EEnrollmentStatus.PENDING && (
          <Tag color="warning">{t('Pending Approval')}</Tag>
        )}
      </Space>

      {/* Enrollment Button */}
      {renderEnrollmentButton()}
    </Card>
  );
}
