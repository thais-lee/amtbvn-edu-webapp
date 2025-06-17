import { TActivity } from '../../activities/activity.model';
import { TAttachmentDto } from '../../attachments/dto/attachment.dto';
import { TCourse } from '../../courses/course.model';

export interface TFileDto {
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

export enum ELessonStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export interface TLessonDto {
  id: number;
  title: string;
  content: string;
  status: ELessonStatus;
  isImportant: boolean;
  previousId: number;
  courseId: number;
  createdAt?: string;
  updatedAt?: string;
  isCompleted?: boolean;
  activitiesCount?: number;
  attachmentsCount?: number;
  attachments?: TAttachmentDto[];
  next?: TLessonDto;
  previous?: TLessonDto;
  activities?: TActivity[];
  course?: TCourse;
  completions?: { isCompleted: boolean; completedAt?: string }[];
}
