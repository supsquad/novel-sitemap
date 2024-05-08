import {
  Collection,
  Entity,
  ManyToMany,
  OneToMany,
  Property,
} from '@mikro-orm/core';
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

  @Property({
    name: 'description',
    columnType: 'text',
    nullable: true,
  })
  description?: string;

  @Property({
    name: 'image',
    columnType: 'varchar(255)',
    nullable: true,
  })
  image?: string;

  @Property({
    name: 'score',
    columnType: 'float(2)',
    default: 10,
  })
  score: number;

  @OneToMany(() => NovelChapterEntity, 'novel')
  chapters?: Collection<NovelChapterEntity>;

  @ManyToMany(() => CategoryEntity, undefined, {
    pivotTable: 'category_novel',
    joinColumn: 'novel_id',
    inverseJoinColumn: 'category_id',
    nullable: true,
  })
  categories?: Collection<CategoryEntity>;

  @ManyToMany(() => AuthorEntity, undefined, {
    pivotTable: 'author_novel',
    joinColumn: 'novel_id',
    inverseJoinColumn: 'author_id',
    nullable: true,
  })
  authors?: Collection<AuthorEntity>;
}
