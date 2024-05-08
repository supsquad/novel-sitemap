import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from '../core/base.entity';
import { NovelEntity } from './novel.entity';

@Entity({ tableName: 'novel_chapter' })
export class NovelChapterEntity extends BaseEntity {
  @Property({
    name: 'name',
  })
  name: string;

  @Property({
    name: 'sequence',
    columnType: 'int',
  })
  sequence: number;

  @Property({
    name: 'content',
    columnType: 'text',
  })
  content: string;

  @ManyToOne(() => NovelEntity)
  novel: NovelEntity;
}
