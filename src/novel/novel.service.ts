import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from 'src/core/base.dto';
import { BaseService } from 'src/core/base.service';
import { NovelEntity } from 'src/entities/novel.entity';

@Injectable()
export class NovelService extends BaseService<NovelEntity> {
  constructor(
    readonly em: EntityManager,

    @InjectRepository(NovelEntity)
    readonly repo: EntityRepository<NovelEntity>,
  ) {
    super(em, repo);
  }

  async listNovels(query: PaginationQueryDto) {
    const data = await this.list(
      query,
      { description: { $ne: null } },
      { exclude: ['description'] },
    );
    return data;
  }

  async getNovelById(id: number) {
    const data = await this.get({ id, description: { $ne: null } });
    return data;
  }
}
