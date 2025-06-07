export interface TCategory {
  id: number;
  name: string;
  slug: string | null;
  imageUrl: string | null;
  parentId: number | null;
  parentCategory: TCategory | null;
  createdAt: Date;
  updatedAt: Date;
  subCategories: TCategory[];
}

export type TSubCategory = TCategory & {
  subCategories: TCategory[];
};
