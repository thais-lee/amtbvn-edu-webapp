import httpService from '@/shared/http-service';
import { TPaginated } from '@/shared/types/paginated.type';

import { TCourse, TCourseEnrolled } from './course.model';
import { TGetManyCoursesInput } from './dto/get-many-course';

class CourseService {
  getManyCourses(input: TGetManyCoursesInput) {
    return httpService.request<TCourse[]>({
      url: '/api/courses',
      method: 'GET',
      params: input,
    });
  }
  getMyCourses(input: TGetManyCoursesInput) {
    return httpService.request<TCourseEnrolled[]>({
      url: '/api/courses/me',
      method: 'GET',
      params: input,
    });
  }
}

export default new CourseService();
