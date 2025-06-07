import httpService from '@/shared/http-service';
import { TPaginated } from '@/shared/types/paginated.type';

import { TArticle } from './article.model';
import { TGetArticlesDto } from './dto/article.dto';

class ArticleService {
  getArticles(input: TGetArticlesDto) {
    return httpService.request<TPaginated<TArticle>>({
      url: '/api/articles',
      method: 'GET',
    });
  }
}

export default new ArticleService();
