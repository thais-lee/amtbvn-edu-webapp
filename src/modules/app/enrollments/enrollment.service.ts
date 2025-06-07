import httpService from '@/shared/http-service';

import { TEnrollment } from './enrollment.model';

class EnrollmentService {
  getEnrollments() {
    return httpService.request<TEnrollment[]>({
      url: '/api/enrollments',
      method: 'GET',
    });
  }
}

export default new EnrollmentService();
