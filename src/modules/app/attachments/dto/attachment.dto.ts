import { TFileDto } from '../../lessons/dto/lesson.dto';

export interface TAttachmentDto {
  fileId: number;
  type: ELessonAttachmentType;
  file: TFileDto;
}

export enum ELessonAttachmentType {
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  DOCUMENT = 'DOCUMENT',
}
