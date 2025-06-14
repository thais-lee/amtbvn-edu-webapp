import { TPaginationInput } from '@/shared/types/pagination-input.type';

import { TCategory } from '../../categories/category.model';
import { TFileDto } from '../../lessons/dto/lesson.dto';

export interface TLibraryMaterialDto {
  id: number;
  title: string;
  description: string;
  tags: string[];
  categoryId: number;
  createdAt: string;
  updatedAt: string;
  thumbnailUrl?: string;

  files: TFileDto[];
  category: TCategory;
}

export interface TGetLibraryMaterialsDto extends TPaginationInput {
  categoryId?: number;
  tags?: string[];
  search?: string;
  sort?: string;
  order?: string;
}
