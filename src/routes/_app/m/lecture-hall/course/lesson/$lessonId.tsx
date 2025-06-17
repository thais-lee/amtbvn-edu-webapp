import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  Button,
  Card,
  Collapse,
  List,
  Skeleton,
  Space,
  Tag,
  Typography,
} from 'antd';
import {
  IoArrowBack,
  IoClipboardOutline,
  IoDocumentAttachOutline,
  IoDocumentTextOutline,
  IoMusicalNotesOutline,
  IoPlayOutline,
  IoTimeOutline,
  IoVideocamOutline,
} from 'react-icons/io5';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

import useApp from '@/hooks/use-app';
import { TActivity } from '@/modules/app/activities/activity.model';
import { EActivityType } from '@/modules/app/activities/dto/activity.dto';
import { TAttachmentDto } from '@/modules/app/attachments/dto/attachment.dto';
import { TLessonDto } from '@/modules/app/lessons/dto/lesson.dto';
import lessonService from '@/modules/app/lessons/lesson.service';

import './styles.css';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

export const Route = createFileRoute(
  '/_app/m/lecture-hall/course/lesson/$lessonId',
)({
  component: LessonDetailComponent,
});

function LessonDetailComponent() {
  const { lessonId } = Route.useParams();
  const navigate = useNavigate();
  const { t } = useApp();

  const { data: lesson, isLoading } = useQuery<TLessonDto>({
    queryKey: ['/lessons', lessonId],
    queryFn: async () => {
      const res = await lessonService.getOne(Number(lessonId));
      return res.data?.data ?? res.data;
    },
    enabled: !!lessonId,
  });

  const attachments = lesson?.attachments || [];
  const documentAttachments: TAttachmentDto[] = attachments.filter(
    (a: TAttachmentDto) => a.type === 'DOCUMENT',
  );
  const audioAttachments: TAttachmentDto[] = attachments.filter(
    (a: TAttachmentDto) => a.type === 'AUDIO',
  );
  const videoAttachment: TAttachmentDto[] = attachments.filter(
    (a: TAttachmentDto) => a.type === 'VIDEO',
  );

  const getAttachmentIcon = (type: string) => {
    if (type === 'DOCUMENT') return <IoDocumentAttachOutline />;
    if (type === 'AUDIO') return <IoMusicalNotesOutline />;
    if (type === 'VIDEO') return <IoVideocamOutline />;
    return <IoDocumentTextOutline />;
  };

  const getActivityTypeColor = (type: TActivity['type']) => {
    switch (type) {
      case EActivityType.QUIZ:
        return 'blue';
      case EActivityType.ASSIGNMENT:
        return 'orange';
      case 'ESSAY':
        return 'purple';
      case 'SHORT_ANSWER':
        return 'cyan';
      case 'TRUE_FALSE':
        return 'geekblue';
      default:
        return 'default';
    }
  };

  const getActivityStatusColor = (status: TActivity['status']) => {
    switch (status) {
      case 'PUBLISHED':
        return 'success';
      case 'DRAFT':
        return 'default';
      case 'ARCHIVED':
        return 'error';
      default:
        return 'default';
    }
  };

  const isCompleted = lesson?.completions?.[0]?.isCompleted ?? false;
  const completedAt = lesson?.completions?.[0]?.completedAt;

  if (isLoading || !lesson) {
    return <Skeleton active paragraph={{ rows: 8 }} />;
  }

  return (
    <div className="lesson-detail">
      <div className="screen-header">
        <div className="screen-header-content">
          <button
            className="back-button"
            onClick={() =>
              navigate({
                to: '/m/lecture-hall/course/$courseId',
                params: { courseId: lesson?.courseId?.toString() },
              })
            }
          >
            <IoArrowBack />
          </button>
          <Title level={4} className="screen-title">
            {''}
          </Title>
        </div>
      </div>
      <Card className="lesson-info-card" style={{ marginTop: 24 }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div className="lesson-header-row">
            <Title level={4} style={{ margin: 0, marginBottom: 12 }}>
              {lesson.title}
            </Title>
            <Space>
              {lesson.isImportant && <Tag color="red">{t('Important')}</Tag>}
            </Space>
            {isCompleted && (
              <Tag color="success" style={{ marginTop: 8 }}>
                {t('Completed')}
                {completedAt && (
                  <span
                    style={{
                      marginLeft: 8,
                      fontWeight: 400,
                      color: '#888',
                    }}
                  >
                    ({new Date(completedAt).toLocaleString()})
                  </span>
                )}
              </Tag>
            )}
          </div>
          <Space direction="horizontal" size="large">
            <Space>
              <Text type="secondary">
                <IoTimeOutline />{' '}
                {lesson.createdAt
                  ? new Date(lesson.createdAt).toLocaleDateString()
                  : ''}
              </Text>
            </Space>
            <Space>
              {lesson.previous && (
                <Button
                  icon={<IoArrowBack />}
                  onClick={() =>
                    lesson.previous &&
                    navigate({
                      to: '/m/lecture-hall/course/lesson/' + lesson.previous.id,
                    })
                  }
                >
                  {t('Previous lesson')}
                </Button>
              )}
            </Space>
            <Space>
              {lesson.next && (
                <Button
                  type="primary"
                  icon={<IoPlayOutline />}
                  onClick={() =>
                    lesson.next &&
                    navigate({
                      to: '/m/lecture-hall/course/lesson/' + lesson.next.id,
                    })
                  }
                >
                  {t('Next lesson')}
                </Button>
              )}
            </Space>
          </Space>
        </Space>
      </Card>
      {videoAttachment[0]?.file?.storagePath ? (
        <div className="video-section">
          <video
            className="lesson-video-player"
            src={videoAttachment[0].file.storagePath}
            controls
            poster={videoAttachment[0].file.thumbnailUrl}
            style={{
              width: '100%',
              maxHeight: 420,
              borderRadius: 8,
              background: '#000',
            }}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      ) : null}

      {(documentAttachments.length > 0 || audioAttachments.length > 0) && (
        <Card className="lesson-attachments-card" style={{ marginTop: 24 }}>
          <Collapse defaultActiveKey={['1']}>
            <Panel
              header={
                <Space>
                  <IoDocumentAttachOutline />
                  <Text strong>{t('Attachments')}</Text>
                  <Tag color="blue">
                    {documentAttachments.length + audioAttachments.length}
                  </Tag>
                </Space>
              }
              key="1"
            >
              <List
                itemLayout="horizontal"
                dataSource={[...documentAttachments, ...audioAttachments]}
                renderItem={(att) => (
                  <List.Item key={att.fileId}>
                    <List.Item.Meta
                      avatar={getAttachmentIcon(att.type)}
                      title={
                        <a
                          href={att.file.storagePath}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {att.file.fileName}
                        </a>
                      }
                      description={<Tag color="blue">{att.type}</Tag>}
                    />
                  </List.Item>
                )}
              />
            </Panel>
          </Collapse>
        </Card>
      )}
      {lesson.activities && lesson.activities.length > 0 && (
        <Card className="lesson-activities-card" style={{ marginTop: 24 }}>
          <Collapse defaultActiveKey={['1']}>
            <Panel
              header={
                <Space>
                  <IoClipboardOutline />
                  <Text strong>{t('Activities')}</Text>
                  <Tag color="blue">{lesson.activities.length}</Tag>
                </Space>
              }
              key="1"
            >
              <List
                itemLayout="horizontal"
                dataSource={lesson.activities}
                renderItem={(activity: TActivity) => (
                  <List.Item
                    key={activity.id}
                    actions={[
                      <Button
                        key="view"
                        type="primary"
                        onClick={() =>
                          navigate({
                            to:
                              '/m/lecture-hall/course/activity/' + activity.id,
                          })
                        }
                      >
                        {t('View')}
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      title={activity.title}
                      description={
                        <Space>
                          <Tag color={getActivityTypeColor(activity.type)}>
                            {activity.type}
                          </Tag>
                          <Tag color={getActivityStatusColor(activity.status)}>
                            {activity.status === 'PUBLISHED'
                              ? t('Published')
                              : activity.status === 'DRAFT'
                                ? t('Draft')
                                : t('Archived')}
                          </Tag>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </Panel>
          </Collapse>
        </Card>
      )}
      <Card className="lesson-content-card" style={{ marginTop: 24 }}>
        <Title level={5} style={{ marginBottom: 12 }}>
          {t('Content')}
        </Title>
        <Paragraph className="lesson-content-text" style={{ fontSize: 16 }}>
          <div className="quill-content-container">
            <ReactQuill
              value={lesson.content}
              readOnly={true}
              theme="bubble"
              style={{ width: '100%', height: '100%' }}
              modules={{
                toolbar: false,
              }}
            />
            <style>{`
            .quill-content-container .ql-editor {
              font-size: 17px;
              line-height: 1.6;
            }
            .quill-content-container .ql-editor h1 {
              font-size: 2em;
            }
            .quill-content-container .ql-editor h2 {
              font-size: 1.5em;
            }
            .quill-content-container .ql-editor h3 {
              font-size: 1.17em;
            }
          `}</style>
          </div>
        </Paragraph>
      </Card>
    </div>
  );
}
