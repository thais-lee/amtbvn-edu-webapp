import { TSearchInput } from '@/shared/types/search-input.type';
import { TSortedInput } from '@/shared/types/sorted-input.type';

export interface TGetManyCoursesInput extends TSortedInput, TSearchInput {
  categoryId?: number;
  status?: 'PUBLIC' | 'PRIVATE';
  requireApproval?: boolean;
}
