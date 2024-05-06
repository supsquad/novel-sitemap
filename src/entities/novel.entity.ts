import { Entity, ManyToMany, OneToMany, Property } from '@mikro-orm/core';
import { BaseEntity } from '../core/base.entity';
import { CategoryEntity } from './category.entity';
import { AuthorEntity } from './author.entity';
import { NovelChapterEntity } from './novelChapter.entity';

@Entity({ tableName: 'novel' })
export class NovelEntity extends BaseEntity {
  @Property({
    name: 'slug',
    columnType: 'varchar(255)',
    nullable: false,
    unique: true,
  })
  slug: string;

  @Property({
    name: 'name',
    columnType: 'varchar(255)',
    nullable: false,
  })
  name: string;

  @Property({
    name: 'original_id',
    columnType: 'varchar(255)',
    nullable: false,
    unique: true,
  })
  originalId: string;

  @Property({
    name: 'tags',
    columnType: 'varchar(255) []',
  })
  tags?: string[];

  @Property({
    name: 'chapter_count',
    columnType: 'int',
    nullable: false,
    default: 0,
  })
  chapterCount: number;

  @OneToMany(() => NovelChapterEntity, 'novel')
  chapters: NovelChapterEntity[];

  @ManyToMany(() => CategoryEntity, undefined, {
    pivotTable: 'category_novel',
    joinColumn: 'novel_id',
    inverseJoinColumn: 'category_id',
  })
  categories?: CategoryEntity[];

  @ManyToMany(() => AuthorEntity, undefined, {
    pivotTable: 'author_novel',
    joinColumn: 'novel_id',
    inverseJoinColumn: 'author_id',
  })
  authors?: AuthorEntity[];
}
