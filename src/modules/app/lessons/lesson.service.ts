import httpService from '@/shared/http-service';

import { TLessonDto } from './dto/lesson.dto';

class LessonService {
  getLessons() {
    return httpService.request<TLessonDto[]>({
      url: '/api/lessons',
      method: 'GET',
    });
  }

  getOne(id: number) {
    return httpService.request<{ data: TLessonDto }>({
      url: `/api/lessons/${id}`,
      method: 'GET',
    });
  }

  getAll(courseId: number) {
    return httpService.request<{ data: TLessonDto[] }>({
      url: `/api/lessons/user`,
      method: 'GET',
      params: {
        courseId,
      },
    });
  }
}

export default new LessonService();
