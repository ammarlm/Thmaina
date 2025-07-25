import { ContentRepository, OrderType, PaginationResponseDto, Program } from '@app/shared';
import { Injectable } from '@nestjs/common';
import { Like } from 'typeorm';

@Injectable()
export class DiscoveryService {
  constructor(
    private contentRepository: ContentRepository,
  ) { }

  async search(query: string, orderBy: string = 'title', order: OrderType= 'ASC', page: number = 1, limit: number = 10): Promise<PaginationResponseDto<Program>> {
    return this.contentRepository.findAll(query, orderBy, order, page, limit);
  }
}
