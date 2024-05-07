import { Entity, ManyToMany, Property } from '@mikro-orm/core';
import { BaseEntity } from '../core/base.entity';
import { UserEntity } from './user.entity';

@Entity({ tableName: 'permission' })
export class PermissionEntity extends BaseEntity {
  @Property({
    name: 'name',
    unique: true,
  })
  name: string;

  @ManyToMany(() => UserEntity, undefined, {
    pivotTable: 'user_permission',
    joinColumn: 'permission_id',
    inverseJoinColumn: 'user_id',
    nullable: true,
  })
  users?: UserEntity[];
}
