import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from 'src/core/base.dto';
import { BaseService } from 'src/core/base.service';
import { NovelChapterEntity } from 'src/entities/novelChapter.entity';

@Injectable()
export class NovelChapterService extends BaseService<NovelChapterEntity> {
  constructor(
    readonly em: EntityManager,

    @InjectRepository(NovelChapterEntity)
    readonly repo: EntityRepository<NovelChapterEntity>,
  ) {
    super(em, repo);
  }

  async getChapterBySlug(novelSlug: string, chapterSlug: string) {
    const data = await this.get({
      novel: { slug: novelSlug },
      slug: chapterSlug,
      content: { $ne: null },
    });
    return data;
  }

  async listNovelChaptersBySlug(slug: string, query: PaginationQueryDto) {
    const data = await this.list(
      query,
      { novel: { slug }, content: { $ne: null } },
      { exclude: ['content'], orderBy: { sequence: 'asc' } },
    );
    return data;
  }
}
