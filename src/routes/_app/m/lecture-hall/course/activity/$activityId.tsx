import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  Button,
  Card,
  Descriptions,
  Divider,
  List,
  Modal,
  Space,
  Tag,
  Typography,
  message,
} from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { IoArrowBack, IoTimeOutline, IoWarningOutline } from 'react-icons/io5';

import useApp from '@/hooks/use-app';
import activityService from '@/modules/app/activities/activity.service';
import ActivityAttemptComponent from '@/modules/app/activities/components/activity-attempt';
import ActivityResultComponent from '@/modules/app/activities/components/activity-result';
import {
  EActivityStatus,
  EActivityType,
  TActivityAttemptDto,
} from '@/modules/app/activities/dto/activity.dto';

import './styles.css';

const { Title, Text, Paragraph } = Typography;

export const Route = createFileRoute(
  '/_app/m/lecture-hall/course/activity/$activityId',
)({
  component: ActivityDetailComponent,
});

function ActivityDetailComponent() {
  const { activityId } = Route.useParams();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState<TActivityAttemptDto | null>(null);
  const [result, setResult] = useState<TActivityAttemptDto | null>(null);
  const { t } = useApp();
  const [reviewAttempt, setReviewAttempt] =
    useState<TActivityAttemptDto | null>(null);
  const [isReviewVisible, setIsReviewVisible] = useState(false);

  const {
    data: activity,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['activity', activityId],
    queryFn: async () => {
      const res = await activityService.getOne(+activityId);
      return res.data;
    },
    enabled: !!activityId,
  });

  const attempts = activity?.attempts ?? [];
  const maxAttempts = activity?.maxAttempts ?? 1;
  const ongoingAttempt = attempts.find((a) => !a.completedAt);
  const attemptsReached = attempts.length >= maxAttempts && !ongoingAttempt;

  const getActivityTypeColor = (type: EActivityType) => {
    switch (type) {
      case EActivityType.QUIZ:
        return 'blue';
      case EActivityType.ASSIGNMENT:
        return 'orange';
      case EActivityType.ESSAY:
        return 'green';
      case EActivityType.SHORT_ANSWER:
        return 'cyan';
      case EActivityType.TRUE_FALSE:
        return 'geekblue';
      default:
        return 'default';
    }
  };
  const getActivityStatusColor = (status: EActivityStatus) => {
    switch (status) {
      case EActivityStatus.PUBLISHED:
        return 'success';
      case EActivityStatus.DRAFT:
        return 'default';
      case EActivityStatus.ARCHIVED:
        return 'error';
      default:
        return 'default';
    }
  };

  const handleStart = async () => {
    try {
      const attempt = await activityService.startAttempt(+activityId);
      setAttempt(attempt.data);
      refetch();
    } catch (e) {
      message.error('Không thể bắt đầu làm bài.');
    }
  };

  const submitMutation = useMutation({
    mutationFn: async (answers: any) => {
      const res = await activityService.submitAttempt(
        attempt?.id ?? 0,
        answers,
      );
      return res.data;
    },
    onSuccess: (data: any) => {
      setAttempt(null);
      if (data && typeof data === 'object' && 'success' in data) {
        setResult(null);
        message.success(data.message || 'Nộp bài thành công.');
      } else {
        setResult(data as any);
        message.success('Nộp bài thành công.');
      }
      refetch();
    },
    onError: () => {
      message.error('Không thể nộp bài.');
    },
  });

  const handleViewAttempt = (attempt: TActivityAttemptDto) => {
    setReviewAttempt(attempt);
    setIsReviewVisible(true);
  };

  const handleCloseReview = () => {
    setIsReviewVisible(false);
    setReviewAttempt(null);
  };

  if (isLoading) {
    return <Card loading />;
  }

  if (attempt) {
    return (
      <ActivityAttemptComponent
        attempt={attempt}
        onFinish={(answers) => submitMutation.mutate(answers)}
        onCancel={() => setAttempt(null)}
      />
    );
  }

  if (result) {
    if (
      typeof result === 'object' &&
      result !== null &&
      'id' in result &&
      'activityId' in result
    ) {
      return (
        <ActivityResultComponent
          result={result as TActivityAttemptDto}
          onBack={() => setResult(null)}
        />
      );
    }
  }

  return (
    <div className="activity-detail">
      <div className="mobile-header">
        <button
          className="back-button"
          onClick={() =>
            navigate({
              to: '/m/lecture-hall/course/$courseId',
              params: { courseId: activity?.courseId?.toString() ?? '' },
            })
          }
        >
          <IoArrowBack />
        </button>
      </div>
      <div style={{ padding: '16px' }}>
        <Card>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div className="activity-header">
              <Space
                align="start"
                style={{
                  width: '100%',
                  flexDirection: 'column',
                  display: 'flex',
                  alignItems: 'flex-start',
                }}
              >
                <Title level={3} style={{ margin: 0 }}>
                  {activity?.title}
                </Title>
                <Space style={{ marginTop: 8 }}>
                  <Tag
                    color={getActivityTypeColor(
                      activity?.type ?? EActivityType.QUIZ,
                    )}
                  >
                    {activity?.type ?? EActivityType.QUIZ}
                  </Tag>
                </Space>
              </Space>
            </div>
            <Descriptions column={1}>
              <Descriptions.Item label="Mô tả">
                <Paragraph>{activity?.description}</Paragraph>
              </Descriptions.Item>
              {activity?.timeLimitMinutes && (
                <Descriptions.Item label="Thời gian làm bài">
                  <Space>
                    <IoTimeOutline />
                    <Text>{activity?.timeLimitMinutes} phút</Text>
                  </Space>
                </Descriptions.Item>
              )}
              {activity?.maxAttempts && (
                <Descriptions.Item label="Số lần làm tối đa">
                  <Text>{activity?.maxAttempts} lần</Text>
                </Descriptions.Item>
              )}
              {activity?.passScore && (
                <Descriptions.Item label="Điểm đạt">
                  <Text>{activity?.passScore}%</Text>
                </Descriptions.Item>
              )}
              {activity?.dueDate && (
                <Descriptions.Item label="Hạn nộp">
                  <Text>
                    {dayjs(activity?.dueDate).format('HH:mm DD/MM/YYYY')}
                  </Text>
                </Descriptions.Item>
              )}
            </Descriptions>
            {/* Attempt History */}
            {attempts.length > 0 && (
              <>
                <Divider orientation="left">Lịch sử làm bài</Divider>
                <List
                  dataSource={attempts}
                  renderItem={(item, idx) => (
                    <List.Item
                      key={item.id}
                      actions={[
                        <Button
                          key={item.id}
                          size="small"
                          onClick={() => handleViewAttempt(item)}
                        >
                          Xem chi tiết
                        </Button>,
                      ]}
                    >
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Text strong>
                          Lần {idx + 1} -{' '}
                          {item.completedAt ? 'Đã nộp' : 'Đang làm'}
                        </Text>
                        <Text>Điểm: {item.score ?? 'Chưa chấm'}</Text>
                        <Text>Trạng thái: {item.gradingStatus}</Text>
                        {item.graderFeedback && (
                          <Text>Phản hồi: {item.graderFeedback}</Text>
                        )}
                        {item.gradedAt && (
                          <Text>
                            Chấm lúc:{' '}
                            {dayjs(item.gradedAt).format('HH:mm DD/MM/YYYY')}
                          </Text>
                        )}
                      </Space>
                    </List.Item>
                  )}
                />
              </>
            )}
            {/* Action Buttons */}
            <div style={{ marginTop: 24 }}>
              {activity?.type === EActivityType.QUIZ &&
                activity?.status === EActivityStatus.PUBLISHED && (
                  <Button
                    type="primary"
                    size="large"
                    block
                    onClick={() => {
                      if (ongoingAttempt) {
                        setAttempt(ongoingAttempt);
                      } else {
                        handleStart();
                      }
                    }}
                    disabled={attemptsReached}
                  >
                    {attemptsReached
                      ? 'Đã đạt số lần làm tối đa'
                      : ongoingAttempt
                        ? 'Tiếp tục làm bài'
                        : 'Bắt đầu làm bài'}
                  </Button>
                )}
              {activity?.type === EActivityType.ASSIGNMENT &&
                activity?.status === EActivityStatus.PUBLISHED && (
                  <Button
                    type="primary"
                    size="large"
                    block
                    onClick={() => {
                      if (ongoingAttempt) {
                        setAttempt(ongoingAttempt);
                      } else {
                        handleStart();
                      }
                    }}
                    disabled={attemptsReached}
                  >
                    {attemptsReached
                      ? 'Đã đạt số lần làm tối đa'
                      : ongoingAttempt
                        ? 'Tiếp tục làm bài'
                        : 'Nộp bài tập'}
                  </Button>
                )}
              {activity?.type === EActivityType.ESSAY &&
                activity?.status === EActivityStatus.PUBLISHED && (
                  <Button type="primary" size="large" block disabled>
                    Tham gia thảo luận
                  </Button>
                )}
              {activity?.status !== EActivityStatus.PUBLISHED && (
                <div style={{ textAlign: 'center' }}>
                  <Space>
                    <IoWarningOutline color="#faad14" />
                    <Text type="warning">
                      Hoạt động này chưa được phát hành
                    </Text>
                  </Space>
                </div>
              )}
            </div>
          </Space>
        </Card>
      </div>
      <Modal
        open={isReviewVisible}
        onCancel={handleCloseReview}
        title="Chi tiết lượt làm bài"
        footer={null}
        width={700}
      >
        {reviewAttempt &&
          typeof reviewAttempt === 'object' &&
          reviewAttempt !== null &&
          'answers' in reviewAttempt &&
          Array.isArray((reviewAttempt as any).answers) && (
            <div>
              <Space
                direction="vertical"
                size="large"
                style={{ width: '100%' }}
              >
                <Text strong>
                  Điểm:{' '}
                  {(reviewAttempt as TActivityAttemptDto).score ?? 'Chưa chấm'}
                </Text>
                <List
                  dataSource={(reviewAttempt as TActivityAttemptDto).answers}
                  renderItem={(ans: any, idx: number) => (
                    <List.Item key={ans.id}>
                      <Card style={{ width: '100%' }}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <Text strong>
                            Câu {idx + 1}: {ans.question?.question}
                          </Text>
                          <Text>
                            Đáp án của bạn:{' '}
                            {ans.selectedOptionId
                              ? ans.question?.options?.find(
                                  (o: any) => o.id === ans.selectedOptionId,
                                )?.text
                              : ans.answer}
                          </Text>
                          {ans.question?.options &&
                            ans.question.options.some(
                              (o: any) => o.isCorrect,
                            ) && (
                              <Text>
                                Đáp án đúng:{' '}
                                {
                                  ans.question.options.find(
                                    (o: any) => o.isCorrect,
                                  )?.text
                                }
                              </Text>
                            )}
                          <Text>Điểm: {ans.score ?? 0}</Text>
                          {ans.feedback && (
                            <Text>Phản hồi: {ans.feedback}</Text>
                          )}
                        </Space>
                      </Card>
                    </List.Item>
                  )}
                />
              </Space>
            </div>
          )}
      </Modal>
    </div>
  );
}
