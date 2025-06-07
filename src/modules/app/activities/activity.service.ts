import httpService from '@/shared/http-service';

import { TActivity } from './activity.model';

class ActivityService {
  getActivities() {
    return httpService.request<TActivity[]>({
      url: '/api/activities',
      method: 'GET',
    });
  }
}

export default new ActivityService();
