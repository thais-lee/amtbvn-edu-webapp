import { TCategory } from '../categories/category.model';
import { EArticleStatus, EArticlesType } from './dto/article.dto';
import { TArticleImageDto } from './dto/article.dto';

export interface TArticle {
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
  category?: TCategory;
}
