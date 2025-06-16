import httpService from '@/shared/http-service';

import {
  TActivityAttemptDto,
  TActivityAttemptResultDto,
  TActivityDetailDto,
} from './dto/activity.dto';

class ActivityService {
  async getOne(id: number) {
    return httpService.request<TActivityDetailDto>({
      url: `/api/activities/user/${id}`,
      method: 'GET',
    });
  }

  async startAttempt(activityId: number) {
    return httpService.request<TActivityAttemptDto>({
      url: `/api/activities/attempts/start`,
      method: 'POST',
      data: { activityId },
    });
  }

  async submitAttempt(attemptId: number, answers: any) {
    return httpService.request<TActivityAttemptDto>({
      url: `/api/activities/attempts/${attemptId}/submit`,
      method: 'POST',
      data: answers,
    });
  }

  async getAttempts(activityId: number) {
    return httpService.request<TActivityAttemptDto[]>({
      url: `/api/activities/attempts`,
      method: 'GET',
      params: {
        activityId,
      },
    });
  }

  async getAttempt(attemptId: number) {
    return httpService.request<TActivityAttemptDto>({
      url: `/api/activities/attempts/${attemptId}`,
      method: 'GET',
    });
  }

  async getAttemptResult(attemptId: number) {
    return httpService.request<TActivityAttemptResultDto>({
      url: `/api/activities/attempts/${attemptId}/result`,
      method: 'GET',
    });
  }
}

export default new ActivityService();
