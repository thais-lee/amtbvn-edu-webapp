import { TSortedInput } from '@/shared/types/sorted-input.type';

export interface TGetManyCategoriesInput extends TSortedInput {
  parentId?: number;
}
