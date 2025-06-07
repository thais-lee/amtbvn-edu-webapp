import httpService from '@/shared/http-service';

class LessonService {
  getLessons() {
    return httpService.request<TLesson[]>({
      url: '/api/lessons',
      method: 'GET',
    });
  }
}

export default new LessonService();
