// src/modules/app/courses/components/course-card.tsx
import { BookOutlined, UserOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
// Import BookOutlined for lessons
import { useNavigate } from '@tanstack/react-router';
import { Button, Card, Space, Tag, Typography, message } from 'antd';
// Import Button and message for notifications
import { useState } from 'react';

// Import useState for local state management
import useApp from '@/hooks/use-app';
import { EEnrollmentStatus } from '@/modules/app/enrollments/enrollment.model';

// Assuming useApp provides t() for translation
import { TCourseDetail, TCourseItem } from '../course.model';
import './course-card.css';

const { Title, Text } = Typography;

type TProps = {
  course: TCourseItem;
  onEnrollSuccess?: (courseId: number) => void; // Optional callback for successful enrollment
};

export default function PendingCourseCard({ course, onEnrollSuccess }: TProps) {
  const navigate = useNavigate();
  const { t } = useApp(); // Access translation function
  const [isEnrolling, setIsEnrolling] = useState(false); // State to manage enrollment loading
  const [isEnrolled, setIsEnrolled] = useState(false); // State to track enrollment status

  const handleCourseClick = (courseId: number) => {
    // navigate({
    //   to: '/m/lecture-hall/course/$courseId',
    //   params: { courseId: courseId.toString() },
    // });
  };

  const handleEnrollClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click from triggering when button is clicked
    if (isEnrolled) return; // Don't do anything if already enrolled

    setIsEnrolling(true);
    try {
      // Simulate API call for enrollment
      // Replace with your actual API call to enroll in the course
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

      // Assuming enrollment is successful and requires admin approval
      message.success(t('Enrollment request submitted. Awaiting approval.'));
      setIsEnrolled(true); // Update local state to reflect enrollment
      onEnrollSuccess?.(course.id); // Trigger optional callback
    } catch (error) {
      console.error('Enrollment failed:', error);
      message.error(t('Failed to enroll in the course. Please try again.'));
    } finally {
      setIsEnrolling(false);
    }
  };

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
              handleCancelRequest(course.id);
            }}
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
          >
            {t('Enroll now')}
          </Button>
        );
      default:
        return (
          <Button
            type="primary"
            block
            onClick={handleEnrollClick}
            loading={isEnrolling}
          >
            {t('Enroll now')}
          </Button>
        );
    }
  };

  const handleCancelRequest = async (courseId: number) => {
    setIsEnrolling(true);
    try {
      // TODO: Replace with actual API call to cancel enrollment
      await new Promise((resolve) => setTimeout(resolve, 1000));
      message.success(t('Deleted successfully'));
      onEnrollSuccess?.(courseId);
    } catch (error) {
      console.error('Failed to cancel enrollment:', error);
      message.error(t('An error occurred'));
    } finally {
      setIsEnrolling(false);
    }
  };

  return (
    <Card
      className="course-card"
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
      </Space>

      {/* Enrollment Button */}
      {isEnrolled ? (
        <Button
          type="default"
          block
          onClick={() => handleCourseClick(course.id)}
        >
          {t('Enrolled - Pending Approval')}
        </Button>
      ) : (
        renderEnrollmentButton()
      )}
    </Card>
  );
}
