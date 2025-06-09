import { TUser } from '@/modules/users/user.model';

import { TCourse } from '../courses/course.model';

export interface TEnrollment {
  id: number;
  courseId: number;
  userId: number;
  status: EEnrollmentStatus;
  enrolledAt: string;
  completedAt: string;
  progressPercentage: number;
  lastAccessedAt: string;
  course: TCourse;
  user: TUser;
}

export enum EEnrollmentStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}
