import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button, Card, Col, Row, Skeleton, Space, Tag, Typography } from 'antd';
import { IoArrowBack, IoPlayOutline, IoTimeOutline } from 'react-icons/io5';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

import useApp from '@/hooks/use-app';
import {
  ELessonAttachmentType,
  TAttachmentDto,
} from '@/modules/app/attachments/dto/attachment.dto';
import courseService from '@/modules/app/courses/course.service';
import { TLessonDto } from '@/modules/app/lessons/dto/lesson.dto';
import lessonService from '@/modules/app/lessons/lesson.service';
import ScreenHeader from '@/shared/components/layouts/app/screen-header';

import './styles.css';

const { Title, Text, Paragraph } = Typography;

export const Route = createFileRoute(
  '/_app/d/lecture-hall/course/lesson/$lessonId',
)({
  component: LessonDetailComponent,
});

function LessonDetailComponent() {
  const { lessonId } = Route.useParams();
  const navigate = useNavigate();
  const { t } = useApp();

  // Always call all hooks at the top
  const { data: lesson, isLoading } = useQuery({
    queryKey: ['/lessons', lessonId],
    queryFn: async () => {
      const res = await lessonService.getOne(Number(lessonId));
      return res.data?.data ?? res.data;
    },
    enabled: !!lessonId,
  });

  // Get courseId from lesson (may be undefined on first render)
  const courseId = lesson?.courseId;

  // Always call this hook, but only enable when courseId is available
  const { data: courseData } = useQuery({
    queryKey: ['course-detail', courseId],
    queryFn: () => courseService.getOneCourse(Number(courseId)),
    enabled: !!courseId,
    select: (res) => res.data,
  });

  if (isLoading || !lesson) {
    return <Skeleton active paragraph={{ rows: 8 }} />;
  }

  const handlePreviousLesson = () => {
    if (lesson.previous) {
      navigate({
        to: '/d/lecture-hall/course/lesson/$lessonId',
        params: { lessonId: lesson.previous.id.toString() },
      });
    }
  };

  const handleNextLesson = () => {
    if (lesson.next) {
      navigate({
        to: '/d/lecture-hall/course/lesson/$lessonId',
        params: { lessonId: lesson.next.id.toString() },
      });
    }
  };

  const handleLessonSidebarClick = (id: string | number) => {
    navigate({
      to: '/d/lecture-hall/course/lesson/$lessonId',
      params: { lessonId: id.toString() },
    });
  };

  // Find the first video attachment
  const videoAttachment = lesson.attachments?.find(
    (a: TAttachmentDto) => a.type === ELessonAttachmentType.VIDEO,
  );

  const courseTitle = courseData?.name || '';
  const lessonsList: TLessonDto[] = courseData?.lessons || [];

  return (
    <div className="lesson-detail">
      <Space
        direction="horizontal"
        size="middle"
        style={{ width: '100%', alignItems: 'center', marginBottom: 16 }}
      >
        <Button
          icon={<IoArrowBack />}
          onClick={() =>
            navigate({
              to: '/d/lecture-hall/course/$courseId',
              params: {
                courseId: courseId?.toString() ?? '',
              },
            })
          }
        >
          {t('Go back')}
        </Button>
      </Space>
      <Title level={3}>{courseTitle}</Title>

      <Row gutter={24}>
        <Col span={15}>
          <div className="lesson-content">
            <div className="video-container">
              {videoAttachment?.file?.storagePath ? (
                <video controls className="video-player">
                  <source
                    src={videoAttachment.file.storagePath}
                    type="video/mp4"
                  />
                </video>
              ) : (
                <div
                  style={{
                    height: 320,
                    background: '#eee',
                    borderRadius: 8,
                  }}
                />
              )}
            </div>
            <Card className="lesson-info">
              <Title level={4}>{lesson.title}</Title>
              <Space
                direction="vertical"
                size="middle"
                style={{ width: '100%' }}
              >
                <div className="lesson-meta">
                  <Space>
                    {lesson.isCompleted && (
                      <Text type="success">{t('Completed')}</Text>
                    )}
                  </Space>
                </div>
                <div className="lesson-content">
                  <ReactQuill
                    value={lesson.content}
                    readOnly={true}
                    theme="bubble"
                    modules={{
                      toolbar: false,
                    }}
                    style={{
                      textAlign: 'justify',
                    }}
                  />
                  <style>{`
                    .lesson-content .ql-editor {
                      padding: 0;
                      font-size: 16px;
                      line-height: 1.8;
                      text-align: justify;
                    }
                    .lesson-content .ql-editor p {
                      margin-bottom: 1em;
                      text-align: justify;
                    }
                    .lesson-content .ql-editor h1,
                    .lesson-content .ql-editor h2,
                    .lesson-content .ql-editor h3,
                    .lesson-content .ql-editor h4 {
                      margin-top: 1.5em;
                      margin-bottom: 0.5em;
                      text-align: left;
                    }
                    .lesson-content .ql-editor ul,
                    .lesson-content .ql-editor ol {
                      margin-bottom: 1em;
                      padding-left: 2em;
                      text-align: justify;
                    }
                    .lesson-content .ql-editor blockquote {
                      border-left: 4px solid #ccc;
                      margin: 1em 0;
                      padding-left: 1em;
                      color: #666;
                      text-align: justify;
                    }
                    .lesson-content .ql-editor img {
                      max-width: 100%;
                      height: auto;
                      margin: 1em 0;
                    }
                  `}</style>
                </div>
                <div className="navigation-buttons">
                  <Space>
                    {lesson.previous && (
                      <Button
                        icon={<IoArrowBack />}
                        onClick={handlePreviousLesson}
                      >
                        {t('Previous lesson')}
                      </Button>
                    )}
                    {lesson.next && (
                      <Button type="primary" onClick={handleNextLesson}>
                        {t('Next lesson')}
                      </Button>
                    )}
                  </Space>
                </div>
              </Space>
            </Card>
          </div>
        </Col>
        <Col span={9}>
          <Card className="sidebar">
            <Title level={5}>{t('Lessons')}</Title>
            <div className="lesson-list-sidebar">
              {lessonsList.map((l: TLessonDto, idx: number) => (
                <div
                  key={l.id}
                  className={`lesson-sidebar-item${
                    String(l.id) === String(lessonId) ? ' active' : ''
                  }${l.isCompleted ? ' completed' : ''}`}
                  onClick={() => handleLessonSidebarClick(l.id)}
                >
                  <div className="lesson-sidebar-index">{idx + 1}</div>
                  <div className="lesson-sidebar-title">{l.title}</div>
                  {l.isCompleted && <Tag color="success">{t('Completed')}</Tag>}
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
