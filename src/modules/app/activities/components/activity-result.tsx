import { Alert, Button, Card, List, Space, Tag, Typography } from 'antd';
import { IoArrowBack } from 'react-icons/io5';

import useApp from '@/hooks/use-app';

import { TActivityAttemptDto } from '../dto/activity.dto';

const { Title, Text } = Typography;

function ActivityResultComponent({
  result,
  onBack,
}: {
  result: TActivityAttemptDto;
  onBack: () => void;
}) {
  const { t } = useApp();

  const getScoreColor = (score: number, passScore: number) => {
    return score >= passScore ? 'success' : 'error';
  };

  return (
    <div className="activity-result">
      <div className="mobile-header">
        <button className="back-button" onClick={onBack}>
          <IoArrowBack />
        </button>
      </div>
      <div style={{ padding: '16px' }}>
        <Card>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div className="result-header">
              <Title level={3}>Kết quả bài làm</Title>
              <Alert
                message={`Điểm số: ${result.score ?? 'Chưa chấm'}`}
                type={getScoreColor(
                  result.score ?? 0,
                  result.activity.passScore ?? 0,
                )}
                showIcon
              />
            </div>
            <List
              dataSource={result.answers}
              renderItem={(answer) => (
                <List.Item key={answer.id}>
                  <Card style={{ width: '100%' }}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Text strong>{answer.question.question}</Text>
                      <Space>
                        <Text>Đáp án của bạn:</Text>
                        <Tag color={answer.isCorrect ? 'success' : 'error'}>
                          {answer.answer}
                        </Tag>
                      </Space>
                      {answer.question.correctAnswer && (
                        <Space>
                          <Text>Đáp án đúng:</Text>
                          <Tag color="success">
                            {answer.question.correctAnswer}
                          </Tag>
                        </Space>
                      )}
                      <Text>Điểm: {answer.score}</Text>
                      {answer.feedback && (
                        <Text type="secondary">
                          Phản hồi: {answer.feedback}
                        </Text>
                      )}
                    </Space>
                  </Card>
                </List.Item>
              )}
            />
            <Button type="primary" block onClick={onBack}>
              Quay lại
            </Button>
          </Space>
        </Card>
      </div>
    </div>
  );
}

export default ActivityResultComponent;
