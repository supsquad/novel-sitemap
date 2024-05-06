import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ abstract: true })
export abstract class BaseEntity {
  @PrimaryKey({ autoincrement: true })
  id: number;

  @Property({
    name: 'created_at',
    columnType: 'timestamp',
    default: new Date().toISOString(),
    nullable: false,
  })
  createdAt: Date;

  @Property({
    name: 'updated_at',
    columnType: 'timestamp',
    onUpdate: () => new Date().toISOString(),
  })
  updatedAt: Date;

  @Property({
    name: 'deleted_at',
    columnType: 'timestamp',
  })
  deletedAt: Date;
}
