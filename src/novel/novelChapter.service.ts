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

  async getChapterById(id: number) {
    const data = await this.get({ id, content: { $ne: null } });
    return data;
  }

  async listNovelChaptersById(id: number, query: PaginationQueryDto) {
    const data = await this.list(
      query,
      { novel: id },
      { exclude: ['content'] },
    );
    return data;
  }
}
