import { InjectRepository } from '@mikro-orm/nestjs';
import {
  EntityManager,
  EntityRepository,
  ObjectQuery,
} from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/base.service';
import { NovelEntity } from 'src/entities/novel.entity';
import { ListNovelsPaginationQueryDto } from './novel.dto';

@Injectable()
export class NovelService extends BaseService<NovelEntity> {
  constructor(
    readonly em: EntityManager,

    @InjectRepository(NovelEntity)
    readonly repo: EntityRepository<NovelEntity>,
  ) {
    super(em, repo);
  }

  async listNovels(query: ListNovelsPaginationQueryDto) {
    let where: ObjectQuery<NovelEntity> = { description: { $ne: null } };
    let orderBy: any = { createdAt: 'asc' };
    if (query.tags) {
      where = { ...where, tags: { $contains: query.tags } };
    }
    if (query.categories) {
      where = { ...where, categories: { $contains: query.categories } };
    }
    if (query.author) {
      where = { ...where, authors: { slug: query.author } };
    }
    if (query.recent) {
      orderBy = { ...orderBy, chapters: { createdAt: 'desc' } };
    }
    const data = await this.list(query, where, {
      exclude: ['description'] as never,
      orderBy,
    });
    return data;
  }

  async getNovelBySlug(slug: string) {
    const data = await this.get(
      { slug, description: { $ne: null } },
      { populate: ['authors'] as never },
    );
    return data;
  }
}
