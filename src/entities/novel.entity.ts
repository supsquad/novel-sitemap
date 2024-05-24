import {
  Collection,
  Entity,
  ManyToMany,
  OneToMany,
  Property,
} from '@mikro-orm/postgresql';
import { BaseEntity } from '../core/base.entity';
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
    defaultRaw: '0',
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
    defaultRaw: '10',
  })
  score: number;

  @Property({
    name: 'categories',
    columnType: 'varchar(255) []',
    nullable: true,
  })
  categories?: string[];

  @OneToMany(() => NovelChapterEntity, 'novel')
  chapters?: Collection<NovelChapterEntity>;

  @ManyToMany(() => AuthorEntity, (author) => author.novels)
  authors?: Collection<AuthorEntity>;
}
