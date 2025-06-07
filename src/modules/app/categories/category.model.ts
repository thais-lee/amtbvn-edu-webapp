export interface TCategory {
  id: number;
  name: string;
  description?: string;
  slug: string;
  imageUrl?: string;
  parentId: number;
  parentCategory: TCategory;
}
