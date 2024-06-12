import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from './core/database.module';
import { SitemapModule } from './sitemap/sitemap.module';

const cronModules =
  process.env.APP_CRON === 'true' ? [ScheduleModule.forRoot()] : [];

@Module({
  imports: [DatabaseModule, ...cronModules, SitemapModule],
})
export class AppModule {}
