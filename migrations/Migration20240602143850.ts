import { Migration } from '@mikro-orm/migrations';

export class Migration20240602143850 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "feedback" ("id" serial primary key, "created_at" timestamp not null default now(), "updated_at" timestamp null, "deleted_at" timestamp null, "email" varchar(255) not null, "message" text not null);');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "feedback" cascade;');
  }

}
