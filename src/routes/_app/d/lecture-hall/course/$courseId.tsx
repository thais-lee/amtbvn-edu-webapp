import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  Button,
  Card,
  Col,
  Progress,
  Row,
  Skeleton,
  Space,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import { IoArrowBack, IoPlayOutline, IoTimeOutline } from 'react-icons/io5';

import useApp from '@/hooks/use-app';
import ActivityList from '@/modules/app/activities/components/activity-list';
import courseService from '@/modules/app/courses/course.service';
import { TLessonDto } from '@/modules/app/lessons/dto/lesson.dto';

import './styles.css';

const { Title, Text, Paragraph } = Typography;

export const Route = createFileRoute('/_app/d/lecture-hall/course/$courseId')({
  component: CourseDetailComponent,
});

function CourseDetailComponent() {
  const { courseId } = Route.useParams();
  const { t } = useApp();
  const navigate = useNavigate();

  const {
    data: course,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['course-detail', courseId],
    queryFn: () => courseService.getOneCourse(Number(courseId)),
    enabled: !!courseId,
    select: (res) => res.data,
  });

  const handleLessonClick = (lessonId: string | number) => {
    navigate({
      to: '/d/lecture-hall/course/lesson/$lessonId',
      params: { lessonId: lessonId.toString() },
    });
  };

  if (isLoading) {
    return (
      <div className="course-detail">
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="course-detail">
        <Text type="danger">Course not found.</Text>
      </div>
    );
  }

  // Calculate progress
  const totalLessons = course.lessons?.length || 0;
  const completedLessons =
    course.lessons?.filter((l: any) => l.completions?.[0]?.isCompleted)
      .length || 0;
  const progress =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="course-detail">
      <Space
        direction="horizontal"
        size="middle"
        style={{ width: '100%', alignItems: 'center', marginBottom: 16 }}
      >
        <Button
          icon={<IoArrowBack />}
          onClick={() =>
            navigate({
              to: '/d/lecture-hall',
            })
          }
        >
          {t('Go back')}
        </Button>
      </Space>
      <Row gutter={24}>
        <Col span={15}>
          <div className="course-content">
            <div className="course-thumbnail">
              <img
                src={course.imageFileUrl ?? '/assets/images/alt-image.jpg'}
                alt={course.name}
              />
            </div>
            <Card className="course-info">
              <Tag className="course-category">{course.category?.name}</Tag>
              <Title level={4}>{course.name}</Title>
              <Paragraph>
                <div
                  dangerouslySetInnerHTML={{
                    __html: course.description ?? '',
                  }}
                />
              </Paragraph>
              <div className="progress-section">
                <Progress
                  percent={progress}
                  strokeColor="#8B4513"
                  showInfo={false}
                />
                <Space className="progress-text">
                  <Text>
                    {t('Progress')}: {progress}%
                  </Text>
                  <Text type="secondary">
                    {t('Completed Lessons')}: {completedLessons}
                    {' /'}
                    {totalLessons} {t('Lessons')}
                  </Text>
                </Space>
              </div>
            </Card>
            <Tabs
              defaultActiveKey="lessons"
              items={[
                {
                  key: 'lessons',
                  label: t('Lessons'),
                  children: (
                    <div className="lessons-list">
                      {course.lessons?.map((lesson: TLessonDto) => {
                        const isCompleted =
                          lesson.completions?.[0]?.isCompleted;
                        return (
                          <Card
                            key={lesson.id}
                            className={`lesson-card ${
                              isCompleted ? 'completed' : ''
                            }`}
                            onClick={() => handleLessonClick(lesson.id)}
                          >
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                justifyContent: 'flex-start',
                                gap: 16,
                              }}
                            >
                              <div className="lesson-info">
                                <Title level={5}>{lesson.title}</Title>
                                <Text type="secondary">
                                  <IoTimeOutline />{' '}
                                  {dayjs(lesson.createdAt).format('DD/MM/YYYY')}
                                </Text>
                                <Space>
                                  <Paragraph
                                    style={{
                                      textAlign: 'justify',
                                      whiteSpace: 'pre-line',
                                    }}
                                    ellipsis={{
                                      rows: 2,
                                    }}
                                  >
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: lesson.content ?? '',
                                      }}
                                    />
                                  </Paragraph>
                                  {isCompleted && (
                                    <Tag color="success">{t('Completed')}</Tag>
                                  )}
                                </Space>
                              </div>
                              <Button
                                type="primary"
                                icon={<IoPlayOutline />}
                                className="play-button"
                                style={{ alignSelf: 'flex-start' }}
                              >
                                {isCompleted
                                  ? t('Watch Again')
                                  : t('Watch Now')}
                              </Button>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  ),
                },
                {
                  key: 'activities',
                  label: t('Activities'),
                  children: (
                    <div className="activities-list">
                      <ActivityList
                        activities={course.activities || []}
                        routePrefix="d"
                      />
                    </div>
                  ),
                },
                {
                  key: 'about',
                  label: t('About'),
                  children: (
                    <Card className="about-card">
                      <Title level={4}>{t('About This Course')}</Title>
                      <Paragraph>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: course.description ?? '',
                          }}
                        />
                      </Paragraph>
                    </Card>
                  ),
                },
              ]}
            />
          </div>
        </Col>
        <Col span={9}>
          <Card className="sidebar">
            <Title level={5}>{t('Course Details')}</Title>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div className="detail-item">
                <Text type="secondary">{t('Category')}</Text>
                <Text strong>{course.category?.name}</Text>
              </div>
              <div className="detail-item">
                <Text type="secondary">{t('Total Lessons')}</Text>
                <Text strong>{totalLessons}</Text>
              </div>
              <div className="detail-item">
                <Text type="secondary">{t('Completed Lessons')}</Text>
                <Text strong>{completedLessons}</Text>
              </div>
              <div className="detail-item">
                <Text type="secondary">{t('Progress')}</Text>
                <Progress
                  percent={progress}
                  size="small"
                  strokeColor="#8B4513"
                />
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
