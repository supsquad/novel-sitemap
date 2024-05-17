import { Entity, Property } from '@mikro-orm/postgresql';
import { BaseEntity } from '../core/base.entity';

@Entity({ tableName: 'category' })
export class CategoryEntity extends BaseEntity {
  @Property({
    name: 'slug',
    columnType: 'varchar(255)',
    unique: true,
  })
  slug: string;

  @Property({
    name: 'name',
    columnType: 'varchar(255)',
  })
  name: string;
}
