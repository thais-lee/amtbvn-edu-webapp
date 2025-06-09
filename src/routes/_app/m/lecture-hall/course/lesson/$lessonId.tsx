import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  Button,
  Card,
  Divider,
  List,
  Skeleton,
  Space,
  Tag,
  Typography,
  message,
} from 'antd';
import {
  IoArrowBack,
  IoDocumentAttachOutline,
  IoDocumentTextOutline,
  IoMusicalNotesOutline,
  IoPlayOutline,
  IoTimeOutline,
  IoVideocamOutline,
} from 'react-icons/io5';

import lessonService, {
  TAttachment,
  TLesson,
} from '@/modules/app/lessons/lesson.service';
import ScreenHeader from '@/shared/components/layouts/app/screen-header';

import './styles.css';

const { Title, Text, Paragraph } = Typography;

export const Route = createFileRoute(
  '/_app/m/lecture-hall/course/lesson/$lessonId',
)({
  component: LessonDetailComponent,
});

function LessonDetailComponent() {
  const { lessonId } = Route.useParams();
  const navigate = useNavigate();

  const { data: lesson, isLoading } = useQuery<TLesson>({
    queryKey: ['/lessons', lessonId],
    queryFn: async () => {
      const res = await lessonService.getOne(Number(lessonId));
      return res.data?.data ?? res.data;
    },
    enabled: !!lessonId,
  });

  const videoAttachment = lesson?.videoAttachment;
  const attachments = lesson?.attachments || [];
  const documentAttachments = attachments.filter(
    (a: TAttachment) => a.type === 'DOCUMENT',
  );
  const audioAttachments = attachments.filter(
    (a: TAttachment) => a.type === 'AUDIO',
  );

  // Helper for attachment icon
  const getAttachmentIcon = (type: string) => {
    if (type === 'DOCUMENT') return <IoDocumentAttachOutline />;
    if (type === 'AUDIO') return <IoMusicalNotesOutline />;
    if (type === 'VIDEO') return <IoVideocamOutline />;
    return <IoDocumentTextOutline />;
  };

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
                params: { courseId: lesson.courseId.toString() },
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

      <div style={{ padding: '16px 0 20px 16px' }}>
        <Title level={4}>{lesson.title}</Title>
      </div>

      {/* Video Player Section */}
      <div className="video-section">
        {videoAttachment && videoAttachment.file?.storagePath ? (
          <video
            className="lesson-video-player"
            src={videoAttachment.file.storagePath}
            controls
            poster={videoAttachment.file.thumbnailUrl}
            style={{
              width: '100%',
              maxHeight: 420,
              borderRadius: 8,
              background: '#000',
            }}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="video-placeholder">
            <IoVideocamOutline size={64} color="#bbb" />
            <Text type="secondary">Không có video cho bài học này</Text>
          </div>
        )}
      </div>

      <Card className="lesson-info-card" style={{ marginTop: 24 }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div className="lesson-header-row">
            <Title level={4} style={{ margin: 0 }}>
              {lesson.title}
            </Title>
            <Space>
              <Tag
                color={lesson.status === 'PUBLISHED' ? 'success' : 'default'}
              >
                {lesson.status === 'PUBLISHED' ? 'Đã phát hành' : 'Nháp'}
              </Tag>
              {lesson.isImportant && <Tag color="red">Quan trọng</Tag>}
            </Space>
          </div>
          <Space>
            <Text type="secondary">
              <IoTimeOutline />{' '}
              {lesson.createdAt
                ? new Date(lesson.createdAt).toLocaleDateString()
                : ''}
            </Text>
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
                Bài trước
              </Button>
            )}
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
                Bài tiếp
              </Button>
            )}
          </Space>
          <Divider style={{ margin: '12px 0' }} />
          <Paragraph className="lesson-content-text" style={{ fontSize: 16 }}>
            {lesson.content}
          </Paragraph>
        </Space>
      </Card>

      {/* Attachments Section */}
      {(documentAttachments.length > 0 || audioAttachments.length > 0) && (
        <Card className="lesson-attachments-card" style={{ marginTop: 24 }}>
          <Title level={5} style={{ marginBottom: 12 }}>
            Tài liệu đính kèm
          </Title>
          <List
            itemLayout="horizontal"
            dataSource={[...documentAttachments, ...audioAttachments]}
            renderItem={(att) => (
              <List.Item>
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
        </Card>
      )}

      {/* Activities Section (if you want to add in the future) */}
      {/* <Card className="lesson-activities-card" style={{ marginTop: 24 }}>
        <Title level={5}>Hoạt động</Title>
        ...
      </Card> */}
    </div>
  );
}
