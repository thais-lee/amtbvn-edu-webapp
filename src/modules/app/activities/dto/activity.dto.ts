import { TCourse } from '@/modules/app/courses/course.model';
import { TLesson } from '@/modules/app/lessons/lesson.model';
import { TUser } from '@/modules/users/user.model';

import { TFileDto } from '../../lessons/dto/lesson.dto';

export interface TActivityMaterialDto {
  activityId: number;
  fileId: number;

  activity: TActivityDetailDto;
  file: TFileDto;
}

export enum EActivityType {
  QUIZ = 'QUIZ',
  ASSIGNMENT = 'ASSIGNMENT',
  ESSAY = 'ESSAY',
  SHORT_ANSWER = 'SHORT_ANSWER',
  TRUE_FALSE = 'TRUE_FALSE',
}

export enum EActivityStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum EActivityQuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TRUE_FALSE = 'TRUE_FALSE',
  SHORT_ANSWER = 'SHORT_ANSWER',
  ESSAY = 'ESSAY',
}

export enum EGradingStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  PENDING_AUTO = 'PENDING_AUTO',
  PENDING_MANUAL = 'PENDING_MANUAL',
  GRADED = 'GRADED',
}

export interface TActivityQuestionOptionDto {
  id: number;
  text: string;
  isCorrect: boolean;
  questionId: number;

  question: TActivityQuestionDto;
  answers: TStudentAnswerDto[];
}

export interface TActivityAttemptDto {
  id: number;
  activityId: number;
  studentId: number;
  graderId: number;
  attemptNumber: number;
  startedAt: Date;
  completedAt: Date;
  score: number;
  gradingStatus: EGradingStatus;
  gradedAt: Date;
  graderFeedback: string;

  student: TUser;
  grader: TUser;
  activity: TActivityDetailDto;
  answers: TStudentAnswerDto[];
}

export interface TActivityQuestionDto {
  id: number;
  question: string;
  type: EActivityQuestionType;
  points: number;
  correctAnswer: string;
  activityId: number;
  createdAt: Date;
  updatedAt: Date;

  activity: TActivityDetailDto;
  options: TActivityQuestionOptionDto[];
  answers: TStudentAnswerDto[];
}

export interface TStudentAnswerDto {
  id: number;
  activityAttemptId: number;
  activityQuestionId: number;
  selectedOptionId: number;
  essayAnswer: string;
  answer: string;
  fileId: number;

  isCorrect: boolean;
  score: number;
  feedback: string;

  createdAt: Date;
  updatedAt: Date;

  activityAttempt: TActivityAttemptDto;
  question: TActivityQuestionDto;
  selectedOption?: TActivityQuestionOptionDto;
  file?: TFileDto;
}

export interface TActivityDetailDto {
  id: number;
  title: string;
  description: string;
  type: EActivityType;
  status: EActivityStatus;
  timeLimitMinutes: number;
  dueDate: Date;
  maxAttempts: number;
  passScore: number;
  shuffleQuestions: boolean;
  creatorId: number;
  courseId?: number | null;
  lessonId?: number | null;
  createdAt: Date;
  updatedAt: Date;

  creator: TUser;
  course: TCourse;
  lesson: TLesson;
  materials: TActivityMaterialDto[];
  questions: TActivityQuestionDto[];
  attempts: TActivityAttemptDto[];
}

export interface TActivity {
  id: number;
  title: string;
  description: string;
  type: 'QUIZ' | 'ASSIGNMENT' | 'DISCUSSION' | 'MATERIAL';
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  timeLimitMinutes?: number;
  dueDate?: string;
  maxAttempts?: number;
  passScore?: number;
  shuffleQuestions?: boolean;
  createdAt: string;
  updatedAt: string;
  materials: Array<{
    File: {
      id: string;
      fileName: string;
      mimeType: string;
      size: number;
      storagePath: string;
    };
  }>;
}

export interface TSubmitAnswerDto {
  questionId: number;
  answer?: string;
  selectedOptionId?: number;
  fileId?: number;
}

export interface TActivityAttemptResultDto {
  id: number;
  activityId: number;
  studentId: number;
  graderId: number;
  attemptNumber: number;
  startedAt: Date;
  completedAt: Date;
  score: number;
  gradingStatus: EGradingStatus;
  gradedAt: Date;
  graderFeedback: string;

  student: TUser;
  grader: TUser;
  activity: TActivityDetailDto;
  answers: TStudentAnswerDto[];
}
