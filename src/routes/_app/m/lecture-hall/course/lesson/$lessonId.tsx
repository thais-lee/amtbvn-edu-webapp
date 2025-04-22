import { createFileRoute } from '@tanstack/react-router';
import { Button, Card, Progress, Space, Typography } from 'antd';
import { IoArrowBack, IoPlayOutline, IoTimeOutline } from 'react-icons/io5';

import ScreenHeader from '@/shared/components/layouts/app/screen-header';

import './styles.css';

const { Title, Text } = Typography;

export const Route = createFileRoute(
  '/_app/m/lecture-hall/course/lesson/$lessonId',
)({
  component: LessonDetailComponent,
});

// Mock data - replace with actual data from your API
const lessonData = {
  id: '1',
  title: '第1講: Introduction',
  description:
    'This is a detailed description of the lesson. It explains what students will learn in this specific lesson.',
  duration: '45:30',
  videoUrl: 'https://example.com/video.mp4',
  courseId: '1',
  courseTitle: '淨土大經科註',
  completed: true,
  nextLessonId: '2',
  previousLessonId: null,
};

function LessonDetailComponent() {
  const { lessonId } = Route.useParams();

  return (
    <div className="lesson-detail">
      <ScreenHeader title={lessonData.courseTitle} showBackButton={true} />

      <div className="lesson-content">
        <div className="video-container">
          <div className="video-placeholder">
            <video width="100%" height="100%" controls autoPlay={true}>
              <source
                src="http://localhost:9000/main/video%2Fcamung.mp4"
                type="video/mp4"
              />
            </video>
          </div>
        </div>

        <Card className="lesson-info">
          <Title level={4}>{lessonData.title}</Title>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div className="lesson-meta">
              <Space>
                <Text type="secondary">
                  <IoTimeOutline /> {lessonData.duration}
                </Text>
                {lessonData.completed && <Text type="success">Completed</Text>}
              </Space>
            </div>

            <Text>{lessonData.description}</Text>

            <div className="navigation-buttons">
              <Space>
                {lessonData.previousLessonId && (
                  <Button
                    icon={<IoArrowBack />}
                    onClick={() => {
                      /* Handle previous lesson navigation */
                    }}
                  >
                    Previous Lesson
                  </Button>
                )}
                {lessonData.nextLessonId && (
                  <Button
                    type="primary"
                    onClick={() => {
                      /* Handle next lesson navigation */
                    }}
                  >
                    Next Lesson
                  </Button>
                )}
              </Space>
            </div>
          </Space>
        </Card>
      </div>
    </div>
  );
}
