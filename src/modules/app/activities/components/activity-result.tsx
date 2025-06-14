import { useQuery } from '@tanstack/react-query';
import { Alert, Button, Card, List, Space, Tag, Typography } from 'antd';
import { IoArrowBack } from 'react-icons/io5';

import useApp from '@/hooks/use-app';

import activityService from '../activity.service';
import {
  EActivityQuestionType,
  TActivityAttemptDto,
  TStudentAnswerDto,
} from '../dto/activity.dto';

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

  const { data: resultData } = useQuery({
    queryKey: ['activity-result', result.id],
    queryFn: () => activityService.getAttemptResult(result.id),
    enabled: !!result.id,
  });

  const answers: TStudentAnswerDto[] = resultData?.data.answers ?? [];

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
              dataSource={answers}
              renderItem={(answer) => {
                const question = answer.question;
                const userAnswer = answer.essayAnswer;
                const selectedOptionId = answer.selectedOptionId;
                const correctOptionId = question.options.find(
                  (opt: any) => opt.isCorrect,
                )?.id;
                const type = question?.type;
                const isMCQ =
                  type === EActivityQuestionType.MULTIPLE_CHOICE ||
                  type === EActivityQuestionType.TRUE_FALSE;
                let displayAnswer = '';
                if (
                  isMCQ &&
                  selectedOptionId &&
                  Array.isArray(question?.options)
                ) {
                  const selectedOption = question.options.find(
                    (opt: any) => opt.id === selectedOptionId,
                  );
                  displayAnswer = selectedOption?.text || '';
                } else {
                  displayAnswer = userAnswer
                    ? String(userAnswer).replace(/^"|"$/g, '')
                    : '';
                }
                return (
                  <List.Item key={answer.id}>
                    <Card style={{ width: '100%' }}>
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Text strong>{question?.question}</Text>
                        <Space>
                          <List
                            dataSource={question?.options}
                            renderItem={(option, index) => {
                              return (
                                <List.Item
                                  key={index}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4,
                                  }}
                                >
                                  <Text
                                    style={{
                                      color: option.isCorrect ? 'green' : 'red',
                                    }}
                                  >
                                    {index + 1}. {option.text}
                                  </Text>
                                </List.Item>
                              );
                            }}
                          />
                        </Space>
                        <Space align="start">
                          <Text>Đáp án của bạn:</Text>
                          {isMCQ ? (
                            <Tag
                              color={
                                selectedOptionId === correctOptionId
                                  ? 'success'
                                  : selectedOptionId !== correctOptionId
                                    ? 'error'
                                    : 'default'
                              }
                            >
                              {displayAnswer}
                            </Tag>
                          ) : (
                            <span
                              style={{
                                display: 'inline-block',
                                maxWidth: 600,
                                whiteSpace: 'pre-line',
                                wordBreak: 'break-word',
                                background: '#fafafa',
                                padding: 8,
                                borderRadius: 4,
                              }}
                            >
                              {displayAnswer}
                            </span>
                          )}
                        </Space>
                        {question?.correctAnswer && (
                          <Space>
                            <Text>Đáp án đúng:</Text>
                            <Tag color="success">{question.correctAnswer}</Tag>
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
                );
              }}
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
