import { Card, Button, Tabs, Tag, Empty, Skeleton } from 'antd';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import ScreenHeader from '@/shared/components/layouts/app/screen-header';
import { IoBookOutline, IoTimeOutline, IoChevronForward } from 'react-icons/io5';
import { useState } from 'react';

import './styles.css';

export const Route = createFileRoute('/_app/m/lecture-hall/')({
  component: LectureHallComponent,
});

// Mock data - replace with actual data from your API
const categories = ['All', '淨土宗', '禪宗', '密宗', '律宗', '天台宗'];

const currentCourses = [
  {
    id: '1',
    title: '淨土大經科註',
    progress: 65,
    lastLesson: '第12講',
    image: '/lectures/02-037.jpg',
    category: '淨土宗',
  },
  {
    id: '2',
    title: '二零一四淨土大經科註',
    progress: 30,
    lastLesson: '第5講',
    image: '/lectures/02-041.jpg',
    category: '淨土宗',
  },
];

const otherCourses = [
  {
    id: '3',
    title: '淨土大經解演義',
    category: '淨土宗',
    image: '/lectures/02-039.jpg',
  },
  {
    id: '4',
    title: '二零一二淨土大經科註',
    category: '淨土宗',
    image: '/lectures/02-040.jpg',
  },
];

function LectureHallComponent() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(false);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    // Here you would typically fetch filtered courses
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000); // Simulate API call
  };

  const handleCourseClick = (courseId: string) => {
    navigate({ to: '/m/lecture-hall/course/$courseId', params: { courseId } });
  };

  const renderCourseCard = (course: any, isCurrent: boolean = false) => (
    <Card
      key={course.id}
      className="course-card"
      onClick={() => handleCourseClick(course.id)}
      cover={
        <div className="course-thumbnail">
          <img src={course.image} alt={course.title} />
          {isCurrent && (
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${course.progress}%` }}
              />
            </div>
          )}
        </div>
      }
    >
      <Card.Meta
        title={course.title}
        description={
          <div className="course-info">
            {isCurrent && (
              <>
                <div className="progress-text">
                  {course.progress}% Complete
                </div>
                <div className="last-lesson">
                  <IoTimeOutline /> Last: {course.lastLesson}
                </div>
              </>
            )}
            <Tag className="course-category">{course.category}</Tag>
          </div>
        }
      />
    </Card>
  );

  const renderCourses = (courses: any[], isCurrent: boolean = false) => {
    if (isLoading) {
      return Array(3).fill(0).map((_, index) => (
        <Skeleton key={index} active className="course-card" />
      ));
    }

    if (courses.length === 0) {
      return (
        <Empty
          description="No courses found"
          className="empty-state"
        />
      );
    }

    return courses.map(course => renderCourseCard(course, isCurrent));
  };

  return (
    <div className="lecture-hall">
      <ScreenHeader title="Lecture Hall" />
      
      <div className="categories-scroll">
        <div className="categories-container">
          {categories.map((category) => (
            <Tag 
              key={category} 
              className={`category-tag ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </Tag>
          ))}
        </div>
      </div>

      <Tabs
        defaultActiveKey="current"
        items={[
          {
            key: 'current',
            label: 'Current Courses',
            children: (
              <div className="courses-section">
                <div className="courses-scroll">
                  <div className="courses-container">
                    {renderCourses(currentCourses, true)}
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
                  <div className="courses-container">
                    {renderCourses(otherCourses)}
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
