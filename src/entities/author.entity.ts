import { Entity, ManyToMany, OneToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from '../core/base.entity';
import { UserEntity } from './user.entity';
import { NovelEntity } from './novel.entity';

@Entity({ tableName: 'author' })
export class AuthorEntity extends BaseEntity {
  @Property({
    name: 'name',
    columnType: 'varchar(255)',
  })
  name: string;

  @Property({
    name: 'slug',
    columnType: 'varchar(255)',
    unique: true,
  })
  slug: string;

  @Property({
    name: 'original_id',
    columnType: 'varchar(255)',
    unique: true,
    nullable: true,
  })
  originalId?: string;

  @OneToOne(() => UserEntity, undefined, { unique: true, nullable: true })
  user?: UserEntity;

  @ManyToMany(() => NovelEntity, undefined, {
    pivotTable: 'author_novel',
    joinColumn: 'author_id',
    inverseJoinColumn: 'novel_id',
    nullable: true,
  })
  novels?: NovelEntity[];
}
