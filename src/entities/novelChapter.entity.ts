import { Entity, ManyToOne, Property, Unique } from '@mikro-orm/postgresql';
import { BaseEntity } from '../core/base.entity';
import { NovelEntity } from './novel.entity';

@Entity({ tableName: 'novel_chapter' })
@Unique({ properties: ['slug', 'novel'] })
export class NovelChapterEntity extends BaseEntity {
  @Property({
    name: 'name',
  })
  name: string;

  @Property({
    name: 'slug',
    columnType: 'varchar(255)',
  })
  slug: string;

  @Property({
    name: 'sequence',
    columnType: 'int',
  })
  sequence: number;

  @Property({
    name: 'content',
    columnType: 'text',
    nullable: true,
  })
  content?: string;

  @ManyToOne(() => NovelEntity)
  novel: NovelEntity;
}
