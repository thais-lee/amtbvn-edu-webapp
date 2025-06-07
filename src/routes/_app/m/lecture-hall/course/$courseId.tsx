import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button, Card, Progress, Space, Tabs, Tag, Typography } from 'antd';
import { IoBookOutline, IoPlayOutline, IoTimeOutline } from 'react-icons/io5';

import ScreenHeader from '@/shared/components/layouts/app/screen-header';

import './styles.css';

const { Title, Text } = Typography;

export const Route = createFileRoute('/_app/m/lecture-hall/course/$courseId')({
  component: CourseDetailComponent,
});

// Mock data - replace with actual data from your API
const courseData = {
  id: '1',
  title: 'Thái Thượng Cảm Ứng Thiên',
  description:
    'Chủ giảng: Lão Pháp Sư Tịnh Không\nGiảng từ ngày 11/05/1999 đến 20/04/2000\nGiảng tại Singapore, Australia, Hồng Kông.\nTổng cộng 195 Tập (AMTB), Bộ dịch gộp 128 Tập \n\nChuyển ngữ: Ban biên dịch Tịnh Không Pháp Ngữ\nGiám định biên dịch: Vọng Tây Cư Sĩ\n\nMã AMTB: 19-012-0001 đến 19-012-0195',
  progress: 65,
  totalLessons: 20,
  completedLessons: 13,
  category: 'Giáo dục',
  image:
    'https://amtbvn.org/wp-content/uploads/2021/04/19-012-thai-thuong-cam-ung-thien-vn.jpg',
  lessons: [
    {
      id: '1',
      title: 'Tập 1: Giới thiệu',
      duration: '45:30',
      completed: true,
    },
    {
      id: '2',
      title: 'Tập 2: Cơ bản',
      duration: '52:15',
      completed: true,
    },
    {
      id: '3',
      title: 'Tập 3: Nâng cao',
      duration: '48:20',
      completed: false,
    },
    {
      id: '4',
      title: 'Tập 4: Ứng dụng thực tế',
      duration: '55:10',
      completed: false,
    },
  ],
};

function CourseDetailComponent() {
  const { courseId } = Route.useParams();
  const navigate = useNavigate();
  const handleLessonClick = (lessonId: string) => {
    navigate({
      to: '/m/lecture-hall/course/lesson/$lessonId',
      params: { lessonId },
    });
  };

  const renderLessonCard = (lesson: any) => (
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
            {lesson.completed && <Tag color="success">Đã xem</Tag>}
          </Space>
        </div>
        <Button type="primary" icon={<IoPlayOutline />} className="play-button">
          {lesson.completed ? 'Xem lại' : 'Xem ngay'}
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="course-detail">
      <ScreenHeader title={courseData.title} />

      <div className="course-header">
        <div className="course-thumbnail">
          <img src={courseData.image} alt={courseData.title} />
        </div>

        <div className="course-info">
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
              <Text>Tiến trình: {courseData.progress}%</Text>
              <Text type="secondary">
                {courseData.completedLessons} / {courseData.totalLessons} bài
                giảng đã hoàn thành
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
                {courseData.lessons.map((lesson) => renderLessonCard(lesson))}
              </div>
            ),
          },
          {
            key: 'about',
            label: 'About',
            children: (
              <Card className="about-card">
                <Title level={4}>Giới thiệu</Title>
                <Text>{courseData.description}</Text>
              </Card>
            ),
          },
        ]}
      />
    </div>
  );
}
