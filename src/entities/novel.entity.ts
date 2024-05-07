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
    unique: true,
  })
  slug: string;

  @Property({
    name: 'name',
    columnType: 'varchar(255)',
  })
  name: string;

  @Property({
    name: 'original_id',
    columnType: 'varchar(255)',
    unique: true,
  })
  originalId: string;

  @Property({
    name: 'tags',
    columnType: 'varchar(255) []',
    nullable: true,
  })
  tags?: string[];

  @Property({
    name: 'chapter_count',
    columnType: 'int',
    default: 0,
  })
  chapterCount: number;

  @OneToMany(() => NovelChapterEntity, 'novel')
  chapters: NovelChapterEntity[];

  @ManyToMany(() => CategoryEntity, undefined, {
    pivotTable: 'category_novel',
    joinColumn: 'novel_id',
    inverseJoinColumn: 'category_id',
    nullable: true,
  })
  categories?: CategoryEntity[];

  @ManyToMany(() => AuthorEntity, undefined, {
    pivotTable: 'author_novel',
    joinColumn: 'novel_id',
    inverseJoinColumn: 'author_id',
    nullable: true,
  })
  authors?: AuthorEntity[];
}
