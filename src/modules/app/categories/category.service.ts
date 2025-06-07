import httpService from '@/shared/http-service';
import { TPaginated } from '@/shared/types/paginated.type';

import { TCategory } from './category.model';
import { TGetManyCategoriesInput } from './dto/get-category.dto';

class CategoryService {
  getManyCategories(input: TGetManyCategoriesInput) {
    return httpService.request<TPaginated<TCategory>>({
      url: '/api/categories/all',
      method: 'GET',
      params: input,
    });
  }
}

export default new CategoryService();
