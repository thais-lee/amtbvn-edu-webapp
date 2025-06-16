import { BookOutlined } from '@ant-design/icons';
import { Empty, Typography } from 'antd';

interface NoCoursesFoundProps {
  message?: string;
  description?: string;
}

const styles = `
.no-courses-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  min-width: 320px;
  width: 100%;
  height: 100%;
  padding: 40px;
  background-color: #fafafa;
  border-radius: 12px;
  margin: 24px 0;
  box-sizing: border-box;
}

.no-courses-icon {
  font-size: 64px;
  color: #1890ff;
  opacity: 0.8;
}

.no-courses-content {
  text-align: center;
  margin-top: 24px;
}

.no-courses-title {
  font-size: 20px;
  font-weight: 500;
  color: #262626;
  margin-bottom: 8px;
}

.no-courses-description {
  font-size: 14px;
  color: #8c8c8c;
  max-width: 400px;
  margin: 0 auto;
  line-height: 1.6;
}
`;

export default function NoCoursesFound({
  message = 'No Courses Found',
  description = 'There are no courses available at the moment. Please check back later.',
}: NoCoursesFoundProps) {
  return (
    <>
      <style>{styles}</style>
      <div className="no-courses-container">
        <Empty
          image={<BookOutlined className="no-courses-icon" />}
          style={{ height: 120, width: '100%' }}
          description={
            <div className="no-courses-content">
              <Typography.Title level={4} className="no-courses-title">
                {message}
              </Typography.Title>
              <Typography.Paragraph
                className="no-courses-description"
                style={{ margin: 0 }}
              >
                {description}
              </Typography.Paragraph>
            </div>
          }
        />
      </div>
    </>
  );
}
