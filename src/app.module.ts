import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from './core/database.module';
import { NovelModule } from './novel/novel.module';
import { RouterModule } from '@nestjs/core';

const cronModules =
  process.env.APP_CRON === 'true'
    ? [ScheduleModule.forRoot(), CategoryModule, NovelModule]
    : [];

@Module({
  imports: [
    DatabaseModule,
    NovelModule,
    ...cronModules
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
