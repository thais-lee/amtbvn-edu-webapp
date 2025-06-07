import httpService from '@/shared/http-service';

import { TAttachment } from './attachment.model';

class AttachmentsService {
  getAttachments() {
    return httpService.request<TAttachment[]>({
      url: '/api/attachments',
      method: 'GET',
    });
  }
}

export default new AttachmentsService();
