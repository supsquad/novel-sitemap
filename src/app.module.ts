import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from './core/database.module';
import { NovelModule } from './novel/novel.module';
import { AuthorModule } from './author/author.module';

const cronModules =
  process.env.APP_CRON === 'true' ? [ScheduleModule.forRoot()] : [];

@Module({
  imports: [
    DatabaseModule,
    ...cronModules,
    CategoryModule,
    NovelModule,
    AuthorModule,
  ],
})
export class AppModule {}
