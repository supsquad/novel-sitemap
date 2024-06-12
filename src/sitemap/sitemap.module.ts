import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import config from '../core/axios.config';
import { SitemapService } from './sitemap.service';
import { CategoryEntity } from '../entities/category.entity';
import { NovelEntity } from '../entities/novel.entity';
import { NovelChapterEntity } from '../entities/novelChapter.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [
    HttpModule.register(config),
    MikroOrmModule.forFeature([
      CategoryEntity,
      NovelEntity,
      NovelChapterEntity,
    ]),
  ],
  providers: [SitemapService],
})
export class SitemapModule {}
