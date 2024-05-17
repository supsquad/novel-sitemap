import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { BaseService } from 'src/core/base.service';
import { AuthorEntity } from 'src/entities/author.entity';

export class AuthorService extends BaseService<AuthorEntity> {
  constructor(
    readonly em: EntityManager,

    @InjectRepository(AuthorEntity)
    readonly repo: EntityRepository<AuthorEntity>,
  ) {
    super(em, repo);
  }

  async getAuthorBySlug(slug: string) {
    const data = await this.get({ slug });
    return data;
  }
}
