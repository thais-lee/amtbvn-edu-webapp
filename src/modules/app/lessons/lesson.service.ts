import httpService from '@/shared/http-service';

export interface TFile {
  id: number;
  fileName: string;
  mimeType: string;
  size: number;
  storagePath: string;
  uploadedBy?: number;
  createdAt?: string;
  updatedAt?: string;
  presignedUrl?: string;
  thumbnailUrl?: string;
}

export interface TAttachment {
  fileId: number;
  type: 'VIDEO' | 'AUDIO' | 'DOCUMENT';
  file: TFile;
}

export interface TLesson {
  id: number;
  title: string;
  content: string;
  courseId: number;
  status?: string;
  isImportant?: boolean;
  createdAt?: string;
  updatedAt?: string;
  attachments: TAttachment[];
  videoAttachment?: TAttachment & { file: TFile };
  previous?: { id: number; title: string };
  next?: { id: number; title: string };
}

class LessonService {
  getLessons() {
    return httpService.request<TLesson[]>({
      url: '/api/lessons',
      method: 'GET',
    });
  }

  getOne(id: number) {
    return httpService.request<{ data: TLesson }>({
      url: `/api/lessons/${id}`,
      method: 'GET',
    });
  }
}

export default new LessonService();
