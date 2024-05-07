import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../core/base.entity';
import { LogSeverity } from '../core/base.constants';

@Entity({ tableName: 'log' })
export class LogEntity extends BaseEntity {
  @Property({
    name: 'type',
    columnType: 'varchar(255)',
  })
  type: string;

  @Property({
    name: 'severity',
    columnType: 'varchar(255)',
    default: LogSeverity.INFO,
  })
  severity: string;

  @Property({
    name: 'memo',
    columnType: 'jsonb',
    nullable: true,
  })
  memo?: {
    last: number;
    current: number;
  };
}
