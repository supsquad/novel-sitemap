import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { NovelEntity } from 'src/entities/novel.entity';
import { PageConfig } from 'src/app.constants';
@Injectable()
export class NovelService {
  constructor (
    private readonly em: EntityManager
  ) {}
  public async list(currentPage: number, perPage?: number) {
    const limit = perPage ? perPage : PageConfig.DEFAULT_PER_PAGE;
    const offset = currentPage * (limit - 1);
    const [ novels, count ] = await this.em.findAndCount(NovelEntity, {}, { limit: limit, offset: offset });
    return novels
  }
}
