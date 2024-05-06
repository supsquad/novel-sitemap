import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../core/base.entity';
import { LogSeverity } from '../core/constants';

@Entity({ tableName: 'log' })
export class LogEntity extends BaseEntity {
  @Property({
    name: 'type',
    columnType: 'varchar(255)',
    nullable: false,
  })
  type: string;

  @Property({
    name: 'severity',
    columnType: 'varchar(255)',
    nullable: false,
    default: LogSeverity.INFO,
  })
  severity: string;

  @Property({
    name: 'memo',
    columnType: 'text',
  })
  log?: string;
}
