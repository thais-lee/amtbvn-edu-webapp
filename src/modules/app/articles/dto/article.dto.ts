import { TPaginationInput } from '@/shared/types/pagination-input.type';
import { TSearchInput } from '@/shared/types/search-input.type';
import { TSortedInput } from '@/shared/types/sorted-input.type';

export interface TArticleImageDto {
  fileId: number;
  order?: number;
}

export interface TArticleDto {
  id: number;
  title: string;
  content: string;
  categoryId: number;
  type: EArticlesType;
  status: EArticleStatus;
  likeCount: number;
  viewCount: number;
  thumbnailUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  images?: TArticleImageDto[];
}

export interface TCreateArticleDto {
  title: string;
  content: string;
  categoryId: number;
  type: EArticlesType;
  status?: EArticleStatus;
  thumbnailUrl?: string;
  images?: TArticleImageDto[];
}

export interface TUpdateArticleDto {
  title?: string;
  content?: string;
  categoryId?: number;
  type?: EArticlesType;
  status?: EArticleStatus;
  thumbnailUrl?: string;
  images?: TArticleImageDto[];
}

export interface TGetArticlesDto
  extends TPaginationInput,
    TSearchInput,
    TSortedInput {
  categoryId?: number;
  type?: EArticlesType;
  status?: EArticleStatus;
}

export enum EArticlesType {
  KNOWLEDGE = 'KNOWLEDGE',
  FAQ = 'FAQ',
  BULLETIN = 'BULLETIN',
}

export enum EArticleStatus {
  PUBLISHED = 'PUBLISHED',
  DRAFT = 'DRAFT',
}
