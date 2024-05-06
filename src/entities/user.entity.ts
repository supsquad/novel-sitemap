import { Entity, ManyToMany, OneToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from '../core/base.entity';
import { PermissionEntity } from './permission.entity';
import { AuthorEntity } from './author.entity';

@Entity({ tableName: 'user' })
export class UserEntity extends BaseEntity {
  @Property({
    name: 'name',
    nullable: false,
    columnType: 'varchar(255)',
  })
  name: string;

  @Property({
    name: 'email',
    nullable: false,
    columnType: 'varchar(255)',
    unique: true,
  })
  email: string;

  @Property({
    name: 'phone',
    columnType: 'varchar(255)',
    unique: true,
  })
  phone: string;

  @Property({
    name: 'password',
    columnType: 'varchar(255)',
    nullable: false,
  })
  password: string;

  @Property({
    name: 'status',
    columnType: 'varchar(255)',
    nullable: false,
    default: 'active',
  })
  status: string;

  @Property({
    name: 'last_login',
    columnType: 'timestamp',
  })
  lastLogin?: Date;

  @OneToOne(() => AuthorEntity, undefined, { unique: true, name: 'author_id' })
  author: AuthorEntity;

  @ManyToMany(() => PermissionEntity, undefined, {
    pivotTable: 'user_permission',
    joinColumn: 'user_id',
    inverseJoinColumn: 'permission_id',
  })
  roles: PermissionEntity[];
}
