import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  Button,
  Card,
  List,
  Modal,
  Skeleton,
  Space,
  Tag,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { IoArrowBack } from 'react-icons/io5';

import useApp from '@/hooks/use-app';
import activityService from '@/modules/app/activities/activity.service';
import ActivityAttemptComponent from '@/modules/app/activities/components/activity-attempt';
import ActivityResultComponent from '@/modules/app/activities/components/activity-result';
import { EActivityStatus } from '@/modules/app/activities/dto/activity.dto';

const { Title, Text, Paragraph } = Typography;

export const Route = createFileRoute(
  '/_app/d/lecture-hall/course/activity/$activityId',
)({
  component: ActivityDetailComponent,
});

function ActivityDetailComponent() {
  const { activityId } = Route.useParams();
  const navigate = useNavigate();
  const { t } = useApp();

  const {
    data: activity,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['activity-detail', activityId],
    queryFn: () => activityService.getOne(Number(activityId)),
    enabled: !!activityId,
    select: (res) => res.data,
  });

  // Fetch attempts for this activity
  const { data: attemptsData, refetch: refetchAttempts } = useQuery({
    queryKey: ['activity-attempts', activityId],
    queryFn: () => activityService.getAttempts(Number(activityId)),
    enabled: !!activityId,
  });
  const attempts = attemptsData?.data || [];
  const canStartNew = activity && attempts.length < activity.maxAttempts;

  // State for showing result/attempt modal
  const [reviewAttempt, setReviewAttempt] = React.useState(null);
  const [doingAttempt, setDoingAttempt] = React.useState(null);

  const startAttemptMutation = useMutation({
    mutationFn: () => activityService.startAttempt(Number(activityId)),
    onSuccess: (res) => {
      setDoingAttempt(res.data as any); // Type assertion to fix type mismatch
      refetchAttempts();
    },
  });

  if (isLoading) {
    return <Skeleton active paragraph={{ rows: 8 }} />;
  }

  if (isError || !activity) {
    return <Text type="danger">Activity not found.</Text>;
  }

  return (
    <div
      className="activity-detail"
      style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}
    >
      <Space
        direction="horizontal"
        size="middle"
        style={{ width: '100%', alignItems: 'center', marginBottom: 16 }}
      >
        <Button
          icon={<IoArrowBack />}
          onClick={() => {
            if (activity.lessonId) {
              navigate({
                to: '/d/lecture-hall/course/lesson/$lessonId',
                params: { lessonId: activity.lessonId.toString() },
              });
            } else if (activity.courseId) {
              navigate({
                to: '/d/lecture-hall/course/$courseId',
                params: { courseId: activity.courseId.toString() },
              });
            } else {
              navigate({ to: '/d/lecture-hall' });
            }
          }}
        >
          {t('Go back')}
        </Button>
      </Space>
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Title level={3}>{activity.title}</Title>
            <Space wrap>
              <Tag color="blue">{activity.type}</Tag>
              <Tag
                color={
                  activity.status === EActivityStatus.PUBLISHED
                    ? 'success'
                    : 'default'
                }
              >
                {activity.status}
              </Tag>
              {activity.dueDate && (
                <Tag color="orange">
                  {t('Due')}: {dayjs(activity.dueDate).format('DD/MM/YYYY')}
                </Tag>
              )}
              {activity.timeLimitMinutes && (
                <Tag color="geekblue">
                  {t('Time Limit')}: {activity.timeLimitMinutes} {t('Minutes')}
                </Tag>
              )}
              {activity.maxAttempts && (
                <Tag color="purple">
                  {t('Max Attempts')}: {activity.maxAttempts}
                </Tag>
              )}
              {activity.passScore && (
                <Tag color="green">
                  {t('Pass Score')}: {activity.passScore}
                </Tag>
              )}
            </Space>
          </div>
          <Paragraph style={{ fontSize: 16 }}>
            <div
              dangerouslySetInnerHTML={{ __html: activity.description ?? '' }}
            />
          </Paragraph>
          <div>
            <Title level={4}>{t('Questions')}</Title>
            <List
              dataSource={activity.questions}
              renderItem={(q, idx) => (
                <List.Item key={q.id}>
                  <Card style={{ width: '100%' }}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Text strong>
                        {t('Questions')} {idx + 1}: {q.question}
                      </Text>
                      <Text type="secondary">
                        {t('Type')}: {q.type} | {t('Points')}: {q.points}
                      </Text>
                      {q.options && q.options.length > 0 && (
                        <div style={{ marginTop: 8 }}>
                          <Text>{t('Options')}:</Text>
                          <ul style={{ margin: 0, paddingLeft: 24 }}>
                            {q.options.map((opt) => (
                              <li key={opt.id}>{opt.text}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </Space>
                  </Card>
                </List.Item>
              )}
            />
          </div>
          {/* Attempts Section */}
          <Card title={t('Your Attempts')} style={{ marginBottom: 24 }}>
            <List
              dataSource={attempts}
              renderItem={(attempt) => (
                <List.Item
                  actions={[
                    <Button
                      key="review"
                      onClick={() => setReviewAttempt(attempt as any)}
                    >
                      {t('Review')}
                    </Button>,
                  ]}
                >
                  <Space>
                    <Text>
                      {t('Attempt')} #{attempt.attemptNumber}
                    </Text>
                    <Tag
                      color={
                        attempt.gradingStatus === 'GRADED'
                          ? 'success'
                          : 'default'
                      }
                    >
                      {attempt.gradingStatus}
                    </Tag>
                    <Text>
                      {t('Score')}: {attempt.score ?? 'N/A'}
                    </Text>
                  </Space>
                </List.Item>
              )}
            />
            {canStartNew && (
              <Button
                type="primary"
                onClick={() => startAttemptMutation.mutate()}
                style={{ marginTop: 16 }}
                loading={startAttemptMutation.isPending}
              >
                {t('Start New Attempt')}
              </Button>
            )}
            {/* Review Modal */}
            <Modal
              open={!!reviewAttempt}
              onCancel={() => setReviewAttempt(null)}
              footer={null}
              width={800}
            >
              {reviewAttempt && (
                <ActivityResultComponent
                  result={reviewAttempt}
                  onBack={() => setReviewAttempt(null)}
                />
              )}
            </Modal>
            {/* Attempt Modal */}
            <Modal
              open={!!doingAttempt}
              onCancel={() => setDoingAttempt(null)}
              footer={null}
              width={800}
              destroyOnClose
            >
              {doingAttempt && (
                <ActivityAttemptComponent
                  attempt={doingAttempt}
                  onFinish={() => {
                    setDoingAttempt(null);
                    refetchAttempts();
                  }}
                  onCancel={() => setDoingAttempt(null)}
                />
              )}
            </Modal>
          </Card>
        </Space>
      </Card>
    </div>
  );
}
