import { useQuery } from '@tanstack/react-query';
import {
  Alert,
  Button,
  Card,
  Form,
  List,
  Radio,
  Space,
  Typography,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { IoArrowBack } from 'react-icons/io5';

import useApp from '@/hooks/use-app';

import activityService from '../activity.service';
import {
  EActivityQuestionType,
  TActivityAttemptDto,
  TSubmitAnswerDto,
} from '../dto/activity.dto';

const { Title, Text } = Typography;

function ActivityAttemptComponent({
  attempt,
  onFinish,
  onCancel,
}: {
  attempt: TActivityAttemptDto;
  onFinish: (answers: { answers: TSubmitAnswerDto[] }) => void;
  onCancel: () => void;
}) {
  const { t } = useApp();
  const { data: attemptData, isLoading: isAttemptLoading } = useQuery({
    queryKey: ['activity-attempt', attempt.id],
    queryFn: () => activityService.getAttempt(attempt.id),
  });

  const [form] = Form.useForm();

  const handleSubmit = (values: Record<string, any>) => {
    const formattedAnswers: TSubmitAnswerDto[] = (
      attemptData?.data.activity.questions || []
    ).map((question) => {
      if (question.type === 'MULTIPLE_CHOICE') {
        return {
          questionId: question.id,
          selectedOptionId: values[`option_${question.id}`],
        };
      } else if (question.type === 'TRUE_FALSE') {
        return {
          questionId: question.id,
          answer: values[`answer_${question.id}`],
        };
      } else if (
        question.type === EActivityQuestionType.SHORT_ANSWER ||
        question.type === EActivityQuestionType.ESSAY ||
        question.type === EActivityQuestionType.TRUE_FALSE
      ) {
        return {
          questionId: question.id,
          answer: values[`answer_${question.id}`],
        };
      }
      return {
        questionId: question.id,
        answer: values[`answer_${question.id}`],
      };
    });
    onFinish({ answers: formattedAnswers });
  };

  if (isAttemptLoading) return <div>Loading...</div>;

  return (
    <div className="activity-attempt">
      <div className="mobile-header">
        <button className="back-button" onClick={onCancel}>
          <IoArrowBack />
        </button>
      </div>
      <div style={{ padding: '16px' }}>
        <Card>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div className="attempt-header">
              <Title level={3}>{attemptData?.data.activity.title}</Title>
              {attemptData?.data.activity.timeLimitMinutes && (
                <Alert
                  message={`Thời gian làm bài: ${attemptData?.data.activity.timeLimitMinutes} phút`}
                  type="info"
                  showIcon
                />
              )}
            </div>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              style={{ width: '100%' }}
            >
              <List
                dataSource={attemptData?.data.activity.questions}
                renderItem={(question, idx) => (
                  <List.Item key={question.id}>
                    <Card style={{ width: '100%' }}>
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Text strong>
                          {t('Question')} {idx + 1}: {question.question}
                        </Text>
                        {question.type === 'MULTIPLE_CHOICE' &&
                          question.options && (
                            <Form.Item
                              name={`option_${question.id}`}
                              rules={[
                                {
                                  required: true,
                                  message: 'Vui lòng chọn một đáp án',
                                },
                              ]}
                            >
                              <Radio.Group
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: 8,
                                }}
                              >
                                {question.options.map((option) => (
                                  <Radio key={option.id} value={option.id}>
                                    {option.text}
                                  </Radio>
                                ))}
                              </Radio.Group>
                            </Form.Item>
                          )}
                        {question.type === 'TRUE_FALSE' && (
                          <Form.Item
                            name={`answer_${question.id}`}
                            rules={[
                              {
                                required: true,
                                message: 'Vui lòng chọn Đúng/Sai',
                              },
                            ]}
                          >
                            <Radio.Group
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 8,
                              }}
                            >
                              {question.options.map((option) => (
                                <Radio key={option.id} value={option.id}>
                                  {option.text}
                                </Radio>
                              ))}
                            </Radio.Group>
                          </Form.Item>
                        )}
                        {(question.type ===
                          EActivityQuestionType.SHORT_ANSWER ||
                          question.type === EActivityQuestionType.ESSAY) && (
                          <Form.Item
                            name={`answer_${question.id}`}
                            rules={[
                              {
                                required: true,
                                message: 'Vui lòng nhập câu trả lời',
                              },
                            ]}
                          >
                            <TextArea
                              rows={3}
                              placeholder="Nhập câu trả lời của bạn"
                            />
                          </Form.Item>
                        )}
                      </Space>
                    </Card>
                  </List.Item>
                )}
              />
              <Form.Item shouldUpdate>
                {() => (
                  <Button
                    type="primary"
                    block
                    htmlType="submit"
                    disabled={
                      !attemptData?.data.activity.questions.every((q) => {
                        if (q.type === 'MULTIPLE_CHOICE') {
                          return (
                            form.getFieldValue(`option_${q.id}`) !== undefined
                          );
                        }
                        return (
                          form.getFieldValue(`answer_${q.id}`) !== undefined &&
                          form.getFieldValue(`answer_${q.id}`) !== ''
                        );
                      })
                    }
                  >
                    Nộp bài
                  </Button>
                )}
              </Form.Item>
            </Form>
          </Space>
        </Card>
      </div>
    </div>
  );
}

export default ActivityAttemptComponent;
