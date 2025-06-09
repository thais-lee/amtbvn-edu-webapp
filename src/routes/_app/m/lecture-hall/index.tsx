import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Skeleton, Tabs, Tag } from 'antd';
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
import ScreenHeader from '@/shared/components/layouts/app/screen-header';

import './styles.css';

enum ECourseType {
  AVAILABLE = 'AVAILABLE',
  MY = 'MY',
  PENDING = 'PENDING',
}

export const Route = createFileRoute('/_app/m/lecture-hall/')({
  component: LectureHallComponent,
});

function LectureHallComponent() {
  const { t } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategory(categoryId);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000); // Simulate API call
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
      return Array(3)
        .fill(0)
        .map((_, index) => (
          <Skeleton key={index} active className="course-card" />
        ));
    }

    switch (type) {
      case ECourseType.AVAILABLE:
        return notEnrolledCoursesQuery.data?.data.items?.length &&
          notEnrolledCoursesQuery.data?.data.items?.length > 0
          ? notEnrolledCoursesQuery.data?.data.items?.map(
              (course: TCourseItem) => (
                <OtherCourseCard key={course.id} course={course} />
              ),
            )
          : renderEmpty(type);
      case ECourseType.MY:
        return myCoursesQuery.data?.data.items?.length &&
          myCoursesQuery.data?.data.items?.length > 0
          ? myCoursesQuery.data?.data.items?.map((course: TCourseEnrolled) => (
              <CurrentCourseCard key={course.course.id} course={course} />
            ))
          : renderEmpty(type);
      case ECourseType.PENDING:
        return pendingCoursesQuery.data?.data.items?.length &&
          pendingCoursesQuery.data?.data.items?.length > 0
          ? pendingCoursesQuery.data?.data.items?.map((course: TCourseItem) => (
              <PendingCourseCard key={course.id} course={course} />
            ))
          : renderEmpty(type);
      default:
        return [];
    }
  };

  return (
    <div className="lecture-hall">
      <ScreenHeader title="Lecture Hall" />

      <div className="categories-scroll">
        <div className="categories-container">
          <Tag
            className={`category-tag ${
              selectedCategory === null ? 'active' : ''
            }`}
            onClick={() => handleCategoryClick(0)}
          >
            {t('All')}
          </Tag>
          {categoriesQuery.data?.data?.items.map((category: any) => (
            <Tag
              style={{
                cursor: 'pointer',
              }}
              key={category.id}
              className={`category-tag ${
                selectedCategory === category.id ? 'active' : ''
              }`}
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.name}
            </Tag>
          ))}
        </div>
      </div>

      <Tabs
        defaultActiveKey="other"
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
