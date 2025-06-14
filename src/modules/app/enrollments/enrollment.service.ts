import httpService from '@/shared/http-service';

import { TEnrollment } from './enrollment.model';

class EnrollmentService {
  getEnrollments() {
    return httpService.request<TEnrollment[]>({
      url: '/api/enrollments',
      method: 'GET',
    });
  }

  enrollCourse(courseId: number) {
    return httpService.request({
      url: '/api/enrollments/student',
      method: 'POST',
      data: { courseId },
    });
  }

  reEnrollCourse(courseId: number) {
    return httpService.request({
      url: '/api/enrollments/user/re-enroll',
      method: 'PATCH',
      params: { courseId },
    });
  }

  deleteEnrollment({ courseId }: { courseId: number }) {
    return httpService.request({
      url: '/api/enrollments/user/delete',
      method: 'DELETE',
      params: { courseId },
    });
  }
}

export default new EnrollmentService();
