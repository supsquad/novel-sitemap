import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from '../core/base.entity';
import { NovelEntity } from './novel.entity';

@Entity({ tableName: 'novel_chapter' })
export class NovelChapterEntity extends BaseEntity {
  @Property({
    name: 'name',
    nullable: false,
  })
  name: string;

  @Property({
    name: 'slug',
    columnType: 'varchar(255)',
    nullable: false,
    unique: true,
  })
  slug: string;

  @Property({
    name: 'sequence',
    columnType: 'int',
    nullable: false,
  })
  sequence: number;

  @Property({
    name: 'content',
    columnType: 'text',
    nullable: false,
  })
  content: string;

  @Property({
    name: 'original_id',
    columnType: 'varchar(255)',
    nullable: false,
    unique: true,
  })
  originalId: string;

  @ManyToOne(() => NovelEntity)
  novel: NovelEntity;
}
