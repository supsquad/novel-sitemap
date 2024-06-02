import { Entity, Property } from '@mikro-orm/postgresql';
import { BaseEntity } from '../core/base.entity';

@Entity({ tableName: 'feedback' })
export class FeedbackEntity extends BaseEntity {
  @Property({
    name: 'email',
    columnType: 'varchar(255)',
  })
  email: string;

  @Property({
    name: 'message',
    columnType: 'text',
  })
  message: string;
}
