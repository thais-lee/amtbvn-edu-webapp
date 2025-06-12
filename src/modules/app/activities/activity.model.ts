import { EActivityStatus, EActivityType } from './dto/activity.dto';

export interface TActivity {
  id: number;
  title: string;
  description: string;
  type: EActivityType;
  status: EActivityStatus;
  timeLimitMinutes?: number;
  dueDate?: string;
  maxAttempts?: number;
  passScore?: number;
  shuffleQuestions?: boolean;
  createdAt: string;
  updatedAt: string;
  materials: Array<{
    file: {
      id: number;
      fileName: string;
      mimeType: string;
      size: number;
      storagePath: string;
    };
  }>;
}
