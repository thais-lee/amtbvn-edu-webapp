import { TCategory } from '../categories/category.model';

export interface TArticle {
  id: number;
  title: string;
  content: string;
  categoryId: number;
  category: TCategory;
}
