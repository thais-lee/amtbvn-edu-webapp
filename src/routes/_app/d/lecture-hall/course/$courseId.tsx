import { Card, Button, Tabs, Tag, Typography, Progress, Space, Row, Col } from 'antd';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import ScreenHeader from '@/shared/components/layouts/app/screen-header';
import { IoTimeOutline, IoBookOutline, IoPlayOutline } from 'react-icons/io5';

import './styles.css';

const { Title, Text } = Typography;

export const Route = createFileRoute('/_app/d/lecture-hall/course/$courseId')({
  component: CourseDetailComponent,
});

// Mock data - replace with actual data from your API
const courseData = {
  id: '1',
  title: '淨土大經科註',
  description: 'This is a detailed description of the course. It explains what students will learn and the benefits of taking this course.',
  progress: 65,
  totalLessons: 20,
  completedLessons: 13,
  category: '淨土宗',
  image: '/lectures/02-037.jpg',
  lessons: [
    { id: '1', title: '第1講: Introduction', duration: '45:30', completed: true },
    { id: '2', title: '第2講: Basic Concepts', duration: '52:15', completed: true },
    { id: '3', title: '第3講: Advanced Topics', duration: '48:20', completed: false },
    { id: '4', title: '第4講: Practical Applications', duration: '55:10', completed: false },
  ]
};

function CourseDetailComponent() {
  const { courseId } = Route.useParams();
  const navigate = useNavigate();

  const handleLessonClick = (lessonId: string) => {
    navigate({ to: '/d/lecture-hall/course/lesson/$lessonId', params: { lessonId } });
  };

  return (
    <div className="course-detail">
      <ScreenHeader title={courseData.title} showBackButton />
      
      <Row gutter={24}>
        <Col span={16}>
          <div className="course-content">
            <div className="course-thumbnail">
              <img src={courseData.image} alt={courseData.title} />
            </div>
            
            <Card className="course-info">
              <Tag className="course-category">{courseData.category}</Tag>
              <Title level={4}>{courseData.title}</Title>
              <Text type="secondary">{courseData.description}</Text>
              
              <div className="progress-section">
                <Progress 
                  percent={courseData.progress} 
                  strokeColor="#8B4513"
                  showInfo={false}
                />
                <Space className="progress-text">
                  <Text>Progress: {courseData.progress}%</Text>
                  <Text type="secondary">
                    {courseData.completedLessons} of {courseData.totalLessons} lessons completed
                  </Text>
                </Space>
              </div>
            </Card>

            <Tabs
              defaultActiveKey="lessons"
              items={[
                {
                  key: 'lessons',
                  label: 'Lessons',
                  children: (
                    <div className="lessons-list">
                      {courseData.lessons.map((lesson) => (
                        <Card
                          key={lesson.id}
                          className={`lesson-card ${lesson.completed ? 'completed' : ''}`}
                          onClick={() => handleLessonClick(lesson.id)}
                        >
                          <div className="lesson-content">
                            <div className="lesson-info">
                              <Title level={5}>{lesson.title}</Title>
                              <Space>
                                <Text type="secondary">
                                  <IoTimeOutline /> {lesson.duration}
                                </Text>
                                {lesson.completed && (
                                  <Tag color="success">Completed</Tag>
                                )}
                              </Space>
                            </div>
                            <Button 
                              type="primary" 
                              icon={<IoPlayOutline />}
                              className="play-button"
                            >
                              {lesson.completed ? 'Watch Again' : 'Watch Now'}
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ),
                },
                {
                  key: 'about',
                  label: 'About',
                  children: (
                    <Card className="about-card">
                      <Title level={4}>About This Course</Title>
                      <Text>{courseData.description}</Text>
                    </Card>
                  ),
                },
              ]}
            />
          </div>
        </Col>
        
        <Col span={8}>
          <Card className="sidebar">
            <Title level={5}>Course Details</Title>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div className="detail-item">
                <Text type="secondary">Category</Text>
                <Text strong>{courseData.category}</Text>
              </div>
              <div className="detail-item">
                <Text type="secondary">Total Lessons</Text>
                <Text strong>{courseData.totalLessons}</Text>
              </div>
              <div className="detail-item">
                <Text type="secondary">Completed Lessons</Text>
                <Text strong>{courseData.completedLessons}</Text>
              </div>
              <div className="detail-item">
                <Text type="secondary">Progress</Text>
                <Progress 
                  percent={courseData.progress} 
                  size="small"
                  strokeColor="#8B4513"
                />
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
} 