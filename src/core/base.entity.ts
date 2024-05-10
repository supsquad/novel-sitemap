import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ abstract: true })
export abstract class BaseEntity {
  @PrimaryKey({ autoincrement: true })
  id: number;

  @Property({
    name: 'created_at',
    columnType: 'timestamp',
    defaultRaw: 'now()',
  })
  createdAt: Date;

  @Property({
    name: 'updated_at',
    columnType: 'timestamp',
    onUpdate: () => new Date().toISOString(),
    nullable: true,
  })
  updatedAt?: Date;

  @Property({
    name: 'deleted_at',
    columnType: 'timestamp',
    nullable: true,
  })
  deletedAt?: Date;
}
