import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { BaseService } from 'src/core/base.service';
import { CategoryEntity } from 'src/entities/category.entity';

export class CategoryService extends BaseService<CategoryEntity> {
  constructor(
    readonly em: EntityManager,

    @InjectRepository(CategoryEntity)
    readonly repo: EntityRepository<CategoryEntity>,
  ) {
    super(em, repo);
  }
}
