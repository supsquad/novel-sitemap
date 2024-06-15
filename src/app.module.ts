import { Module } from '@nestjs/common';
import { DatabaseModule } from './core/database.module';
import { SitemapModule } from './sitemap/sitemap.module';

@Module({
  imports: [DatabaseModule, SitemapModule],
})
export class AppModule {}
