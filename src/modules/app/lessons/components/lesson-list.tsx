import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Button, Card, List, Skeleton, Tag, Tooltip, Typography } from 'antd';
import dayjs from 'dayjs';
import {
  IoCheckmarkCircleOutline,
  IoPlayOutline,
  IoStarOutline,
} from 'react-icons/io5';

import useApp from '@/hooks/use-app';
import lessonService from '@/modules/app/lessons/lesson.service';

import { TLessonDto } from '../dto/lesson.dto';

interface LessonListProps {
  courseId: number;
}

export default function LessonList({ courseId }: LessonListProps) {
  const navigate = useNavigate();
  const { t } = useApp();

  const { data, isLoading, error } = useQuery<{ data: TLessonDto[] }>({
    queryKey: ['lessons', courseId],
    queryFn: async () => {
      const res = await lessonService.getAll(courseId);
      return res.data;
    },
    enabled: !!courseId,
  });

  const lessons = data?.data ?? [];

  if (isLoading) return <Skeleton active paragraph={{ rows: 6 }} />;
  if (error) return <div>Error loading lessons.</div>;
  if (!lessons || lessons.length === 0) return <div>No lessons found.</div>;

  return (
    <Card styles={{ body: { padding: 0 } }}>
      <List
        dataSource={lessons}
        renderItem={(lesson) => (
          <List.Item
            key={lesson.id}
            style={{
              padding: 0,
              borderBottom: '1px solid #f0f0f0',
              background: lesson.isCompleted ? '#f6ffed' : undefined,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                width: '100%',
                padding: '16px 16px 0 16px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Typography.Text
                strong
                style={{
                  fontSize: 17,
                  flex: 1,
                  minWidth: 0,
                  wordBreak: 'break-word',
                  paddingRight: 10,
                }}
              >
                {lesson.title}
              </Typography.Text>
              {lesson.isImportant && (
                <Tooltip title={t('Important')}>
                  <IoStarOutline color="#faad14" style={{ fontSize: 18 }} />
                </Tooltip>
              )}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                padding: '0 16px 16px 16px',
                gap: 16,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {lesson.isCompleted && (
                    <Tooltip title={t('Complete')}>
                      <IoCheckmarkCircleOutline
                        color="#52c41a"
                        style={{ fontSize: 18 }}
                      />
                    </Tooltip>
                  )}
                </div>
                <div
                  style={{
                    marginTop: 8,
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 8,
                  }}
                >
                  <Tag
                    color={
                      lesson.status === 'PUBLISHED' ? 'success' : 'default'
                    }
                  >
                    {lesson.status === 'PUBLISHED'
                      ? t('Published')
                      : t('Draft')}
                  </Tag>
                  <Tag color="blue">
                    {t('Activities - Quiz')}: {lesson.activitiesCount}
                  </Tag>
                  <Tag color="purple">
                    {t('Attachments')}: {lesson.attachmentsCount}
                  </Tag>
                  <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                    {t('updated')}:{' '}
                    {dayjs(lesson.updatedAt).format('DD/MM/YYYY')}
                  </Typography.Text>
                </div>
              </div>
              {/* Right: View Button */}
              <div style={{ marginLeft: 16 }}>
                <Button
                  type="primary"
                  icon={<IoPlayOutline />}
                  style={{
                    background: '#8B4513',
                    borderColor: '#8B4513',
                    fontWeight: 600,
                    minWidth: 90,
                  }}
                  onClick={() =>
                    navigate({
                      to: '/m/lecture-hall/course/lesson/' + lesson.id,
                    })
                  }
                >
                  {t('View')}
                </Button>
              </div>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
}
