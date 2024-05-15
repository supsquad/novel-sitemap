import {
  Collection,
  Entity,
  ManyToMany,
  OneToOne,
  Property,
} from '@mikro-orm/postgresql';
import { BaseEntity } from '../core/base.entity';
import { PermissionEntity } from './permission.entity';
import { AuthorEntity } from './author.entity';

@Entity({ tableName: 'user' })
export class UserEntity extends BaseEntity {
  @Property({
    name: 'name',
    columnType: 'varchar(255)',
  })
  name: string;

  @Property({
    name: 'email',
    columnType: 'varchar(255)',
    unique: true,
  })
  email: string;

  @Property({
    name: 'phone',
    columnType: 'varchar(255)',
    unique: true,
    nullable: true,
  })
  phone?: string;

  @Property({
    name: 'password',
    columnType: 'varchar(255)',
  })
  password: string;

  @Property({
    name: 'status',
    columnType: 'varchar(255)',
    default: 'active',
  })
  status: string;

  @Property({
    name: 'last_login',
    columnType: 'timestamp',
    nullable: true,
  })
  lastLogin?: Date;

  @OneToOne(() => AuthorEntity, undefined, {
    unique: true,
    name: 'author_id',
    nullable: true,
  })
  author?: AuthorEntity;

  @ManyToMany(() => PermissionEntity, undefined, {
    pivotTable: 'user_permission',
    joinColumn: 'user_id',
    inverseJoinColumn: 'permission_id',
    nullable: true,
  })
  permissions?: Collection<PermissionEntity>;
}
