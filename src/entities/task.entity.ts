import { Entity, OneToOne, Property } from '@mikro-orm/postgresql';
import { BaseEntity } from '../core/base.entity';
import { NovelEntity } from './novel.entity';

@Entity({ tableName: 'task' })
export class TaskEntity extends BaseEntity {
  @Property({
    name: 'type',
    columnType: 'varchar(255)',
  })
  scope: string;

  @Property({
    name: 'name',
    columnType: 'varchar(255)',
  })
  name: string;

  @Property({
    name: 'current',
    columnType: 'int',
    nullable: true,
  })
  current?: number;

  @Property({
    name: 'priority',
    columnType: 'int',
    defaultRaw: '1',
  })
  priority: number;

  @Property({
    name: 'last',
    columnType: 'int',
    nullable: true,
  })
  last?: number;

  @OneToOne(() => NovelEntity, undefined, { unique: true, nullable: true })
  novel?: NovelEntity;
}
