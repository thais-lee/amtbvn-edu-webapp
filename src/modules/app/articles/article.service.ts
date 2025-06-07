// article.service.ts
import httpService from '@/shared/http-service';
import { TPaginated } from '@/shared/types/paginated.type';

import { TArticle } from './article.model';
import {
  TCreateArticleDto,
  TGetArticlesDto,
  TUpdateArticleDto,
} from './dto/article.dto';

class ArticleService {
  // Lấy danh sách bài viết với phân trang và filter
  getArticles(input: TGetArticlesDto) {
    return httpService.request<TPaginated<TArticle>>({
      url: '/api/articles',
      method: 'GET',
      params: input,
    });
  }

  // Lấy chi tiết một bài viết theo ID
  getArticleById(id: number) {
    return httpService.request<TArticle>({
      url: `/api/articles/${id}`,
      method: 'GET',
    });
  }

  // Tạo bài viết mới
  createArticle(data: TCreateArticleDto) {
    return httpService.request<TArticle>({
      url: '/api/articles',
      method: 'POST',
      data,
    });
  }

  // Cập nhật bài viết
  updateArticle(id: number, data: TUpdateArticleDto) {
    return httpService.request<TArticle>({
      url: `/api/articles/${id}`,
      method: 'PATCH',
      data,
    });
  }

  // Xóa bài viết
  deleteArticle(id: number) {
    return httpService.request<void>({
      url: `/api/articles/${id}`,
      method: 'DELETE',
    });
  }

  // Lấy bài viết theo slug
  getArticleBySlug(slug: string) {
    return httpService.request<TArticle>({
      url: `/api/articles/slug/${slug}`,
      method: 'GET',
    });
  }

  // Tìm kiếm bài viết
  searchArticles(query: string) {
    return httpService.request<TPaginated<TArticle>>({
      url: '/api/articles/search',
      method: 'GET',
      params: { query },
    });
  }

  // Lấy bài viết theo category
  getArticlesByCategory(categoryId: number, input: TGetArticlesDto) {
    return httpService.request<TPaginated<TArticle>>({
      url: `/api/articles/category/${categoryId}`,
      method: 'GET',
      params: input,
    });
  }

  // Lấy bài viết nổi bật
  getFeaturedArticles() {
    return httpService.request<TArticle[]>({
      url: '/api/articles/featured',
      method: 'GET',
    });
  }

  // Lấy bài viết liên quan
  getRelatedArticles(articleId: number) {
    return httpService.request<TArticle[]>({
      url: `/api/articles/${articleId}/related`,
      method: 'GET',
    });
  }
}

export default new ArticleService();
