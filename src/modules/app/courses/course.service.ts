import httpService from '@/shared/http-service';
import { TPaginated } from '@/shared/types/paginated.type';

import { TCourseDetail, TCourseEnrolled, TCourseItem } from './course.model';
import { TGetManyCoursesInput } from './dto/get-many-course';

class CourseService {
  getManyCourses(input: TGetManyCoursesInput) {
    return httpService.request<TPaginated<TCourseItem>>({
      url: '/api/courses',
      method: 'GET',
      params: input,
    });
  }
  getMyCourses(input: TGetManyCoursesInput) {
    return httpService.request<TPaginated<TCourseEnrolled>>({
      url: '/api/courses/me',
      method: 'GET',
      params: input,
    });
  }

  getNotEnrolledCourses(input: TGetManyCoursesInput) {
    return httpService.request<TPaginated<TCourseItem>>({
      url: '/api/courses/not-enrolled',
      method: 'GET',
      params: input,
    });
  }

  getPendingCourses(input: TGetManyCoursesInput) {
    return httpService.request<TPaginated<TCourseItem>>({
      url: '/api/courses/pending',
      method: 'GET',
      params: input,
    });
  }

  getOneCourse(id: number) {
    return httpService.request<TCourseDetail>({
      url: `/api/courses/user/${id}`,
      method: 'GET',
    });
  }

  getCourseUserProgress(id: number) {
    return httpService.request<any>({
      url: `/api/courses/${id}/user-progress`,
      method: 'GET',
    });
  }
}

export default new CourseService();
