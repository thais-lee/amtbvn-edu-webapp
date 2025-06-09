import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button, Card, Progress, Space, Tabs, Tag, Typography } from 'antd';
import { IoArrowBack, IoPlayOutline, IoTimeOutline } from 'react-icons/io5';

import courseService from '@/modules/app/courses/course.service';

import './styles.css';

const { Title, Text } = Typography;

export const Route = createFileRoute('/_app/m/lecture-hall/course/$courseId')({
  component: CourseDetailComponent,
});

function CourseDetailComponent() {
  const { courseId } = Route.useParams();
  const navigate = useNavigate();

  const { data: course, isLoading } = useQuery({
    queryKey: ['/courses', courseId, 'user-progress'],
    queryFn: () => courseService.getCourseUserProgress(Number(courseId)),
    enabled: !!courseId,
  });

  const handleLessonClick = (lessonId: number) => {
    navigate({
      to: '/m/lecture-hall/course/lesson/$lessonId',
      params: { lessonId: lessonId.toString() },
    });
  };

  const renderActivityProgress = (activity: any) => (
    <Card size="small" style={{ marginBottom: 8 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Text strong>{activity.title}</Text>
        <Space>
          <Tag color="blue">{activity.type}</Tag>
          <Tag color={activity.status === 'PUBLISHED' ? 'success' : 'default'}>
            {activity.status === 'PUBLISHED' ? 'Đã phát hành' : 'Nháp'}
          </Tag>
          {activity.dueDate && (
            <Tag color="orange">
              Hạn: {new Date(activity.dueDate).toLocaleDateString()}
            </Tag>
          )}
        </Space>
        {activity.latestAttempt ? (
          <Space>
            <Tag
              color={
                activity.latestAttempt.completedAt ? 'success' : 'processing'
              }
            >
              {activity.latestAttempt.completedAt ? 'Đã nộp' : 'Đang làm'}
            </Tag>
            <Text type="secondary">
              Điểm: {activity.latestAttempt.score ?? 'Chưa chấm'}
            </Text>
          </Space>
        ) : (
          <Text type="secondary">Chưa làm</Text>
        )}
      </Space>
    </Card>
  );

  const renderLessonCard = (lesson: any) => (
    <Card
      key={lesson.id}
      className={`lesson-card ${lesson.isCompleted ? 'completed' : ''}`}
      onClick={() => handleLessonClick(lesson.id)}
    >
      <div className="lesson-content">
        <div className="lesson-info">
          <Title level={5}>{lesson.title}</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text type="secondary">{lesson.content}</Text>
            <Space>
              <Text type="secondary">
                <IoTimeOutline />{' '}
                {lesson.completedAt
                  ? `Hoàn thành: ${new Date(
                      lesson.completedAt,
                    ).toLocaleDateString()}`
                  : 'Chưa hoàn thành'}
              </Text>
              {lesson.isCompleted && <Tag color="success">Đã xem</Tag>}
            </Space>
            {/* Attachments */}
            {lesson.attachments && lesson.attachments.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">Tài liệu:</Text>
                <ul style={{ margin: 0, paddingLeft: 16 }}>
                  {lesson.attachments.map((att: any) => (
                    <li key={att.fileId}>
                      <a
                        href={att.file.storagePath}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {att.file.fileName}
                      </a>{' '}
                      <Text type="secondary">({att.type})</Text>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* Activities */}
            {lesson.activities && lesson.activities.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <Text strong>Hoạt động:</Text>
                {lesson.activities.map((activity: any) =>
                  renderActivityProgress(activity),
                )}
              </div>
            )}
          </Space>
        </div>
        <Button type="primary" icon={<IoPlayOutline />} className="play-button">
          {lesson.isCompleted ? 'Xem lại' : 'Xem ngay'}
        </Button>
      </div>
    </Card>
  );

  if (isLoading || !course?.data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="course-detail">
      <div className="screen-header">
        <div className="screen-header-content">
          <button
            className="back-button"
            onClick={() => navigate({ to: '/m/lecture-hall' })}
          >
            <IoArrowBack />
          </button>
          <Title level={4} className="screen-title">
            {course.data.name}
          </Title>
        </div>
      </div>

      <div className="course-header">
        <div className="course-thumbnail">
          <img src={course.data.bannerFileUrl} alt={course.data.name} />
        </div>

        <div className="course-info">
          <Title level={4}>{course.data.name}</Title>
          <Text type="secondary">{course.data.description}</Text>

          <div className="progress-section">
            <Progress
              percent={Math.round(course.data.progress)}
              strokeColor="#8B4513"
              showInfo={false}
            />
            <Space className="progress-text">
              <Text>Tiến trình: {Math.round(course.data.progress)}%</Text>{' '}
              <Text type="secondary">
                {course.data.lessons.filter((l: any) => l.isCompleted).length} /{' '}
                {course.data.lessons.length} bài giảng đã hoàn thành
              </Text>
            </Space>
          </div>
        </div>
      </div>

      <Tabs
        defaultActiveKey="lessons"
        items={[
          {
            key: 'lessons',
            label: 'Lessons',
            children: (
              <div className="lessons-list">
                {course.data.lessons.map((lesson: any) =>
                  renderLessonCard(lesson),
                )}
              </div>
            ),
          },
          {
            key: 'about',
            label: 'About',
            children: (
              <Card className="about-card">
                <Title level={4}>Giới thiệu</Title>
                <Text>{course.data.description}</Text>
              </Card>
            ),
          },
        ]}
      />
    </div>
  );
}
