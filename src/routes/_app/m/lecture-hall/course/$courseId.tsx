import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Card, Progress, Space, Tabs, Typography } from 'antd';
import { IoArrowBack } from 'react-icons/io5';

import useApp from '@/hooks/use-app';
import ActivityList from '@/modules/app/activities/components/activity-list';
import courseService from '@/modules/app/courses/course.service';
import LessonList from '@/modules/app/lessons/components/lesson-list';

import './styles.css';

const { Title, Text } = Typography;

export const Route = createFileRoute('/_app/m/lecture-hall/course/$courseId')({
  component: CourseDetailComponent,
});

function CourseDetailComponent() {
  const { courseId } = Route.useParams();
  const navigate = useNavigate();
  const { t } = useApp();

  const { data: course, isLoading } = useQuery({
    queryKey: ['/courses', courseId, 'user-progress'],
    queryFn: () => courseService.getCourseUserProgress(Number(courseId)),
    enabled: !!courseId,
  });

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
          <div
            dangerouslySetInnerHTML={{ __html: course.data.description }}
            style={{}}
          />

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
            label: t('Lessons'),
            children: <LessonList courseId={Number(courseId)} />,
          },

          {
            key: 'activities',
            label: t('Activities - Quiz'),
            children: (
              <ActivityList
                activities={course.data.activities}
                routePrefix="m"
              />
            ),
          },
          {
            key: 'introduction',
            label: t('Introduction'),
            children: (
              <Card className="about-card">
                <Title level={4}>{t('Introduction')}</Title>
                {/* TODO: display rich text, no limit, ellipsis */}
                <div
                  dangerouslySetInnerHTML={{ __html: course.data.description }}
                  style={{
                    display: 'block',
                    overflow: 'auto',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '100%',
                    maxHeight: '100%',
                  }}
                />
              </Card>
            ),
          },
        ]}
      />
    </div>
  );
}
