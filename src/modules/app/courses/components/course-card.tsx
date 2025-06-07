import { ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from '@tanstack/react-router';
import { Card, Space, Tag, Typography } from 'antd';

import { TCourse, TCourseEnrolled } from '../course.model';
import './course-card.css';

const { Title, Text } = Typography;

type TProps = {
  course: TCourse | TCourseEnrolled;
  isCurrent: boolean;
};

export default function CourseCard({ course, isCurrent }: TProps) {
  const navigate = useNavigate();
  const handleCourseClick = (courseId: number) => {
    navigate({
      to: '/m/lecture-hall/course/$courseId',
      params: { courseId: courseId.toString() },
    });
  };

  const renderCard = (courseData: TCourse | TCourseEnrolled['course']) => {
    return (
      <Card
        hoverable
        className="course-card"
        cover={
          <div className="course-image-container">
            <img
              src={courseData.imageFileUrl ?? '/assets/images/alt-image.jpg'}
              alt={courseData.name}
              className="course-image"
            />
            {isCurrent && (
              <div className="course-status">
                <Tag color="success">Enrolled</Tag>
              </div>
            )}
          </div>
        }
        onClick={() => handleCourseClick(courseData.id)}
      >
        <div className="course-content">
          <Title level={4} className="course-title">
            {courseData.name}
          </Title>

          {courseData.description && (
            <Text className="course-description" ellipsis>
              {courseData.description}
            </Text>
          )}

          <div className="course-meta">
            <Space className="course-meta-item">
              <ClockCircleOutlined />
              <Text type="secondary">
                {new Date(courseData.createdAt).toLocaleDateString()}
              </Text>
            </Space>
            <Space className="course-meta-item">
              <UserOutlined />
              <Text type="secondary">0 Students</Text>
            </Space>
          </div>
        </div>
      </Card>
    );
  };

  return isCurrent
    ? renderCard((course as TCourseEnrolled).course)
    : renderCard(course as TCourse);
}

// Add this CSS to your styles file
const styles = `
.course-card {
  width: 100%;
  max-width: 400px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.course-image-container {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.course-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.course-card:hover .course-image {
  transform: scale(1.05);
}

.course-status {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 1;
}

.course-content {
  padding: 16px;
}

.course-title {
  margin-bottom: 8px !important;
  font-size: 18px !important;
  line-height: 1.4 !important;
}

.course-description {
  color: #666;
  margin-bottom: 16px;
  display: block;
}

.course-meta {
  display: flex;
  gap: 16px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.course-meta-item {
  color: #8c8c8c;
  font-size: 14px;
}

.course-meta-item .anticon {
  color: #8c8c8c;
}
`;
