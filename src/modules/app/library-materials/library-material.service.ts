import httpService from '@/shared/http-service';
import { TPaginated } from '@/shared/types/paginated.type';

import {
  TGetLibraryMaterialsDto,
  TLibraryMaterialDto,
} from './dto/library-material.dto';

class LibraryMaterialService {
  getAllLibraryMaterials(input: TGetLibraryMaterialsDto) {
    return httpService.request<TPaginated<TLibraryMaterialDto>>({
      url: `/api/library-materials`,
      method: 'GET',
      params: input,
    });
  }

  getOneLibraryMaterial(id: number) {
    return httpService.request<TLibraryMaterialDto>({
      url: `/api/library-materials/${id}`,
      method: 'GET',
    });
  }

  downloadFile(materialId: number, fileId: number) {
    return httpService.request<{ url: string }>({
      url: `/api/library-materials/${materialId}/files/${fileId}/download`,
      method: 'GET',
    });
  }
}

export default new LibraryMaterialService();
