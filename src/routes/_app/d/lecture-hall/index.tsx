import { useQuery } from '@tanstack/react-query';
import {
  createFileRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { Col, ConfigProvider, Row, Skeleton, Tabs, Tag } from 'antd';
import { useState } from 'react';

import useApp from '@/hooks/use-app';
import categoryService from '@/modules/app/categories/category.service';
import CurrentCourseCard from '@/modules/app/courses/components/current-course-card';
import NoCoursesFound from '@/modules/app/courses/components/no-courses-found';
import OtherCourseCard from '@/modules/app/courses/components/other-course-card';
import PendingCourseCard from '@/modules/app/courses/components/pending-course-card';
import {
  TCourseEnrolled,
  TCourseItem,
} from '@/modules/app/courses/course.model';
import courseService from '@/modules/app/courses/course.service';
import { PageHeader } from '@/shared/components/layouts/app/page-header';
import ScreenHeader from '@/shared/components/layouts/app/screen-header';

import './styles.css';

enum ECourseType {
  AVAILABLE = 'AVAILABLE',
  MY = 'MY',
  PENDING = 'PENDING',
}

export const Route = createFileRoute('/_app/d/lecture-hall/')({
  component: LectureHallComponent,
});

function LectureHallComponent() {
  const { t } = useApp();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTabKey, setActiveTabKey] = useState(search.tab || 'other');

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAllCategories({ parentId: 13 }),
  });

  const myCoursesQuery = useQuery({
    queryKey: ['current-courses', selectedCategory],
    queryFn: () =>
      courseService.getMyCourses({
        categoryId: selectedCategory ?? undefined,
        status: 'PUBLIC',
      }),
  });

  const notEnrolledCoursesQuery = useQuery({
    queryKey: ['courses', selectedCategory],
    queryFn: () =>
      courseService.getNotEnrolledCourses({
        categoryId: selectedCategory ?? undefined,
        status: 'PUBLIC',
      }),
  });

  const pendingCoursesQuery = useQuery({
    queryKey: ['pending-courses', selectedCategory],
    queryFn: () =>
      courseService.getPendingCourses({
        categoryId: selectedCategory ?? undefined,
        status: 'PUBLIC',
        requireApproval: true,
      }),
  });

  const handleCategoryClick = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000); // Simulate API call
  };

  const handleTabChange = (key: string) => {
    setActiveTabKey(key);
    navigate({ to: '/d/lecture-hall', search: { tab: key } });

    // Refetch data when switching to My Courses tab
    if (key === 'current') {
      myCoursesQuery.refetch();
    }
  };

  const renderEmpty = (type: ECourseType) => {
    switch (type) {
      case ECourseType.AVAILABLE:
        return (
          <NoCoursesFound
            message={t('No Available Courses')}
            description={''}
          />
        );
      case ECourseType.MY:
        return (
          <NoCoursesFound
            message={t('No Enrolled Courses')}
            description={t(
              'Explore more courses to find something interesting',
            )}
          />
        );
      case ECourseType.PENDING:
        return (
          <NoCoursesFound message={t('No Pending Approval')} description={''} />
        );
    }
  };

  const renderCourses = (type: ECourseType) => {
    if (isLoading) {
      return (
        <Row gutter={[24, 24]}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <Col key={index} xs={24} sm={12} md={8} lg={6} xl={6}>
                <Skeleton active className="course-card" />
              </Col>
            ))}
        </Row>
      );
    }

    let items: any[] = [];
    switch (type) {
      case ECourseType.AVAILABLE:
        items = notEnrolledCoursesQuery.data?.data.items || [];
        break;
      case ECourseType.MY:
        items = myCoursesQuery.data?.data.items || [];
        break;
      case ECourseType.PENDING:
        items = pendingCoursesQuery.data?.data.items || [];
        break;
    }
    if (!items.length) {
      return (
        <Row>
          <Col span={24}>{renderEmpty(type)}</Col>
        </Row>
      );
    }
    return (
      <Row gutter={[24, 24]}>
        {items.map((course: any) => {
          if (type === ECourseType.MY) {
            return (
              <Col key={course.course.id} xs={24} sm={12} md={8} lg={6} xl={6}>
                <CurrentCourseCard course={course} routePrefix="d" />
              </Col>
            );
          } else if (type === ECourseType.PENDING) {
            return (
              <Col key={course.id} xs={24} sm={12} md={8} lg={6} xl={6}>
                <PendingCourseCard
                  course={course}
                  routePrefix="d"
                  onEnrollSuccess={(_, status) => {
                    if (status === 'other') {
                      handleTabChange('other');
                      notEnrolledCoursesQuery.refetch();
                    } else {
                      // Re-enroll: just refetch, don't switch tab
                      pendingCoursesQuery.refetch();
                      notEnrolledCoursesQuery.refetch();
                    }
                  }}
                />
              </Col>
            );
          } else {
            return (
              <Col key={course.id} xs={24} sm={12} md={8} lg={6} xl={6}>
                <OtherCourseCard
                  course={course}
                  routePrefix="d"
                  onEnrollSuccess={(_, status) => {
                    if (status === 'current') {
                      handleTabChange('current');
                      myCoursesQuery.refetch();
                      notEnrolledCoursesQuery.refetch();
                    } else if (status === 'pending') {
                      handleTabChange('pending');
                      pendingCoursesQuery.refetch();
                      notEnrolledCoursesQuery.refetch();
                    }
                  }}
                />
              </Col>
            );
          }
        })}
      </Row>
    );
  };

  return (
    <div className="lecture-hall">
      <PageHeader title={t('Lecture Hall')} />

      <div className="categories-section" style={{ marginBottom: 32 }}>
        <div
          className="categories-container"
          style={{ gap: 16, flexWrap: 'wrap' }}
        >
          <Tag
            className="category-tag"
            onClick={() => handleCategoryClick(null)}
            style={{
              fontSize: 18,
              padding: '8px 24px',
              marginBottom: 8,
              cursor: 'pointer',
              background: selectedCategory === null ? '#a15318' : '#f5f5f5',
              color: selectedCategory === null ? '#fff' : '#a15318',
              border: 'none',
              fontWeight: selectedCategory === null ? 600 : 400,
              transition: 'all 0.2s',
            }}
          >
            {t('All')}
          </Tag>
          {categoriesQuery.data?.data?.items.map((category: any) => (
            <Tag
              style={{
                fontSize: 18,
                padding: '8px 24px',
                marginBottom: 8,
                cursor: 'pointer',
                background:
                  selectedCategory === category.id ? '#a15318' : '#f5f5f5',
                color: selectedCategory === category.id ? '#fff' : '#a15318',
                border: 'none',
                fontWeight: selectedCategory === category.id ? 600 : 400,
                transition: 'all 0.2s',
              }}
              key={category.id}
              className="category-tag"
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.name}
            </Tag>
          ))}
        </div>
      </div>

      <Tabs
        activeKey={activeTabKey as string}
        onChange={handleTabChange}
        items={[
          {
            key: 'other',
            label: t('Available Courses'),
            children: (
              <div className="courses-section">
                {renderCourses(ECourseType.AVAILABLE)}
              </div>
            ),
          },
          {
            key: 'current',
            label: t('My Courses'),
            children: (
              <div className="courses-section">
                {renderCourses(ECourseType.MY)}
              </div>
            ),
          },
          {
            key: 'pending',
            label: t('Pending Approval'),
            children: (
              <div className="courses-section">
                {renderCourses(ECourseType.PENDING)}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}

export default LectureHallComponent;
