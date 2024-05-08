import { Collection, Entity, ManyToMany, Property } from '@mikro-orm/core';
import { BaseEntity } from '../core/base.entity';
import { NovelEntity } from './novel.entity';

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

  @ManyToMany(() => NovelEntity, undefined, {
    pivotTable: 'category_novel',
    joinColumn: 'category_id',
    inverseJoinColumn: 'novel_id',
    nullable: true,
  })
  novels?: Collection<NovelEntity>;
}
