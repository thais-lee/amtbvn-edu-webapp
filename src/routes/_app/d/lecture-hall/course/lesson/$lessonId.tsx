import { Card, Button, Typography, Space, Row, Col, Tag } from 'antd';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import ScreenHeader from '@/shared/components/layouts/app/screen-header';
import { IoPlayOutline, IoTimeOutline, IoArrowBack } from 'react-icons/io5';

import './styles.css';

const { Title, Text } = Typography;

export const Route = createFileRoute('/_app/d/lecture-hall/course/lesson/$lessonId')({
  component: LessonDetailComponent,
});

// Mock data - replace with actual data from your API
const lessonData = {
  id: '1',
  title: '第1講: Introduction',
  description: 'This is a detailed description of the lesson. It explains what students will learn in this specific lesson.',
  duration: '45:30',
  videoUrl: 'https://example.com/video.mp4',
  courseId: '1',
  courseTitle: '淨土大經科註',
  completed: true,
  nextLessonId: '2',
  previousLessonId: null,
  courseLessons: [
    { id: '1', title: '第1講: Introduction', duration: '45:30', completed: true },
    { id: '2', title: '第2講: Basic Concepts', duration: '52:15', completed: false },
    { id: '3', title: '第3講: Advanced Topics', duration: '48:20', completed: false },
    { id: '4', title: '第4講: Practical Applications', duration: '55:10', completed: false },
  ]
};

function LessonDetailComponent() {
  const { lessonId } = Route.useParams();
  const navigate = useNavigate();

  const handlePreviousLesson = () => {
    if (lessonData.previousLessonId) {
      navigate({ to: '/d/lecture-hall/course/lesson/$lessonId', params: { lessonId: lessonData.previousLessonId } });
    }
  };

  const handleNextLesson = () => {
    if (lessonData.nextLessonId) {
      navigate({ to: '/d/lecture-hall/course/lesson/$lessonId', params: { lessonId: lessonData.nextLessonId } });
    }
  };

  return (
    <div className="lesson-detail">
      <ScreenHeader 
        title={lessonData.courseTitle}
        showBackButton
      />
      
      <Row gutter={24}>
        <Col span={16}>
          <div className="lesson-content">
            <div className="video-container">
              <video
                controls
                autoPlay
                className="video-player"
              >
                <source src="http://localhost:9000/main/video%2Fcamung.mp4" type="video/mp4" />
              </video>
            </div>

            <Card className="lesson-info">
              <Title level={4}>{lessonData.title}</Title>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div className="lesson-meta">
                  <Space>
                    <Text type="secondary">
                      <IoTimeOutline /> {lessonData.duration}
                    </Text>
                    {lessonData.completed && (
                      <Text type="success">Completed</Text>
                    )}
                  </Space>
                </div>
                
                <Text>{lessonData.description}</Text>
                
                <div className="navigation-buttons">
                  <Space>
                    {lessonData.previousLessonId && (
                      <Button 
                        icon={<IoArrowBack />}
                        onClick={handlePreviousLesson}
                      >
                        Previous Lesson
                      </Button>
                    )}
                    {lessonData.nextLessonId && (
                      <Button 
                        type="primary"
                        onClick={handleNextLesson}
                      >
                        Next Lesson
                      </Button>
                    )}
                  </Space>
                </div>
              </Space>
            </Card>
          </div>
        </Col>
        
        <Col span={8}>
          <Card className="sidebar">
            <Title level={5}>Course Lessons</Title>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {lessonData.courseLessons.map((lesson) => (
                <Card
                  key={lesson.id}
                  className={`lesson-item ${lesson.id === lessonId ? 'active' : ''} ${lesson.completed ? 'completed' : ''}`}
                  onClick={() => {/* Handle lesson navigation */}}
                >
                  <div className="lesson-item-content">
                    <div className="lesson-item-info">
                      <Text strong={lesson.id === lessonId}>{lesson.title}</Text>
                      <Text type="secondary">
                        <IoTimeOutline /> {lesson.duration}
                      </Text>
                    </div>
                    {lesson.completed && (
                      <Tag color="success">Completed</Tag>
                    )}
                  </div>
                </Card>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
} 