import { Migration } from '@mikro-orm/migrations';

export class Migration20240507033211 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "category" ("id" serial primary key, "created_at" timestamp not null default \'2024-05-07T03:32:11.569Z\', "updated_at" timestamp null, "deleted_at" timestamp null, "slug" varchar(255) not null, "name" varchar(255) not null, "original_id" varchar(255) not null);',
    );
    this.addSql(
      'alter table "category" add constraint "category_slug_unique" unique ("slug");',
    );
    this.addSql(
      'alter table "category" add constraint "category_original_id_unique" unique ("original_id");',
    );

    this.addSql(
      'create table "log" ("id" serial primary key, "created_at" timestamp not null default \'2024-05-07T03:32:11.569Z\', "updated_at" timestamp null, "deleted_at" timestamp null, "type" varchar(255) not null, "severity" varchar(255) not null default \'INFO\', "memo" text null);',
    );

    this.addSql(
      'create table "novel" ("id" serial primary key, "created_at" timestamp not null default \'2024-05-07T03:32:11.569Z\', "updated_at" timestamp null, "deleted_at" timestamp null, "slug" varchar(255) not null, "name" varchar(255) not null, "original_id" varchar(255) not null, "tags" varchar(255) [] null, "chapter_count" int not null default 0);',
    );
    this.addSql(
      'alter table "novel" add constraint "novel_slug_unique" unique ("slug");',
    );
    this.addSql(
      'alter table "novel" add constraint "novel_original_id_unique" unique ("original_id");',
    );

    this.addSql(
      'create table "novel_chapter" ("id" serial primary key, "created_at" timestamp not null default \'2024-05-07T03:32:11.569Z\', "updated_at" timestamp null, "deleted_at" timestamp null, "name" varchar(255) not null, "slug" varchar(255) not null, "sequence" int not null, "content" text not null, "original_id" varchar(255) not null, "novel_id" int not null);',
    );
    this.addSql(
      'alter table "novel_chapter" add constraint "novel_chapter_slug_unique" unique ("slug");',
    );
    this.addSql(
      'alter table "novel_chapter" add constraint "novel_chapter_original_id_unique" unique ("original_id");',
    );

    this.addSql(
      'create table "category_novel" ("novel_id" int not null, "category_id" int not null, constraint "category_novel_pkey" primary key ("novel_id", "category_id"));',
    );

    this.addSql(
      'create table "permission" ("id" serial primary key, "created_at" timestamp not null default \'2024-05-07T03:32:11.569Z\', "updated_at" timestamp null, "deleted_at" timestamp null, "name" varchar(255) not null);',
    );
    this.addSql(
      'alter table "permission" add constraint "permission_name_unique" unique ("name");',
    );

    this.addSql(
      'create table "user" ("id" serial primary key, "created_at" timestamp not null default \'2024-05-07T03:32:11.569Z\', "updated_at" timestamp null, "deleted_at" timestamp null, "name" varchar(255) not null, "email" varchar(255) not null, "phone" varchar(255) null, "password" varchar(255) not null, "status" varchar(255) not null default \'active\', "last_login" timestamp null, "author_id" int null);',
    );
    this.addSql(
      'alter table "user" add constraint "user_email_unique" unique ("email");',
    );
    this.addSql(
      'alter table "user" add constraint "user_phone_unique" unique ("phone");',
    );
    this.addSql(
      'alter table "user" add constraint "user_author_id_unique" unique ("author_id");',
    );

    this.addSql(
      'create table "user_permission" ("user_id" int not null, "permission_id" int not null, constraint "user_permission_pkey" primary key ("user_id", "permission_id"));',
    );

    this.addSql(
      'create table "author" ("id" serial primary key, "created_at" timestamp not null default \'2024-05-07T03:32:11.569Z\', "updated_at" timestamp null, "deleted_at" timestamp null, "name" varchar(255) not null, "slug" varchar(255) not null, "original_id" varchar(255) null, "user_id" int null);',
    );
    this.addSql(
      'alter table "author" add constraint "author_slug_unique" unique ("slug");',
    );
    this.addSql(
      'alter table "author" add constraint "author_original_id_unique" unique ("original_id");',
    );
    this.addSql(
      'alter table "author" add constraint "author_user_id_unique" unique ("user_id");',
    );

    this.addSql(
      'create table "author_novel" ("novel_id" int not null, "author_id" int not null, constraint "author_novel_pkey" primary key ("novel_id", "author_id"));',
    );

    this.addSql(
      'alter table "novel_chapter" add constraint "novel_chapter_novel_id_foreign" foreign key ("novel_id") references "novel" ("id") on update cascade;',
    );

    this.addSql(
      'alter table "category_novel" add constraint "category_novel_novel_id_foreign" foreign key ("novel_id") references "novel" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "category_novel" add constraint "category_novel_category_id_foreign" foreign key ("category_id") references "category" ("id") on update cascade on delete cascade;',
    );

    this.addSql(
      'alter table "user" add constraint "user_author_id_foreign" foreign key ("author_id") references "author" ("id") on update cascade on delete set null;',
    );

    this.addSql(
      'alter table "user_permission" add constraint "user_permission_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "user_permission" add constraint "user_permission_permission_id_foreign" foreign key ("permission_id") references "permission" ("id") on update cascade on delete cascade;',
    );

    this.addSql(
      'alter table "author" add constraint "author_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete set null;',
    );

    this.addSql(
      'alter table "author_novel" add constraint "author_novel_novel_id_foreign" foreign key ("novel_id") references "novel" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "author_novel" add constraint "author_novel_author_id_foreign" foreign key ("author_id") references "author" ("id") on update cascade on delete cascade;',
    );
  }
}
