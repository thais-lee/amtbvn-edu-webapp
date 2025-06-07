import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button, Card, Skeleton, Tabs, Tag } from 'antd';
import { useState } from 'react';
import { IoChevronForward, IoTimeOutline } from 'react-icons/io5';

import useApp from '@/hooks/use-app';
import categoryService from '@/modules/app/categories/category.service';
import CourseCard from '@/modules/app/courses/components/course-card';
import NoCoursesFound from '@/modules/app/courses/components/no-courses-found';
import { TCourse, TCourseEnrolled } from '@/modules/app/courses/course.model';
import courseService from '@/modules/app/courses/course.service';
import ScreenHeader from '@/shared/components/layouts/app/screen-header';

import './styles.css';

export const Route = createFileRoute('/_app/m/lecture-hall/')({
  component: LectureHallComponent,
});

function LectureHallComponent() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useApp();

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () =>
      categoryService.getManyCategories({
        parentId: 13,
      }),
  });

  const currentCoursesQuery = useQuery({
    queryKey: ['courses', selectedCategory],
    queryFn: () =>
      courseService.getMyCourses({
        categoryId: selectedCategory ?? 0,
        status: 'PUBLIC',
      }),
  });

  const otherCoursesQuery = useQuery({
    queryKey: ['other-courses', selectedCategory],
    queryFn: () =>
      courseService.getManyCourses({
        categoryId: selectedCategory ?? 0,
        status: 'PUBLIC',
      }),
  });

  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategory(categoryId);
    // Here you would typically fetch filtered courses
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000); // Simulate API call
  };

  const renderCourses = (courses: any[], isCurrent: boolean = false) => {
    if (isLoading) {
      return Array(3)
        .fill(0)
        .map((_, index) => (
          <Skeleton key={index} active className="course-card" />
        ));
    }

    if (courses.length === 0) {
      return (
        <NoCoursesFound
          message={isCurrent ? 'No Enrolled Courses' : 'No Available Courses'}
          description={
            isCurrent
              ? "You haven't enrolled in any courses yet. Browse our course catalog to find something interesting."
              : 'There are no courses available in this category at the moment. Please check back later.'
          }
        />
      );
    }

    return courses.map((course) => (
      <CourseCard key={course.id} course={course} isCurrent={isCurrent} />
    ));
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
          {categoriesQuery.data?.data?.items.map((category) => (
            <Tag
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
        defaultActiveKey="current"
        items={[
          {
            key: 'current',
            label: t('Current Courses'),
            children: (
              <div className="courses-section">
                <div className="courses-scroll">
                  <div className="courses-container">
                    {renderCourses(currentCoursesQuery.data?.data ?? [], true)}
                  </div>
                </div>
                <Button type="link" className="watch-more-btn">
                  Watch More <IoChevronForward />
                </Button>
              </div>
            ),
          },
          {
            key: 'other',
            label: 'Other Courses',
            children: (
              <div className="courses-section">
                <div className="courses-scroll">
                  <div
                    className="courses-container"
                    style={{
                      //1 card per row fix height
                      gap: 16,
                      display: 'grid',
                      gridTemplateColumns: 'repeat(1, 1fr)',
                      // height: 300
                    }}
                  >
                    {renderCourses(otherCoursesQuery.data?.data ?? [], false)}
                  </div>
                </div>
                <Button type="link" className="watch-more-btn">
                  Watch More <IoChevronForward />
                </Button>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
