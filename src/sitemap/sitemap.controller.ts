import { Controller, Get, Header } from '@nestjs/common';
import { SitemapService } from './sitemap.service';

@Controller('sitemap')
export class SitemapController {
  constructor(private readonly sitemapService: SitemapService) {}

  @Get('category.xml')
  @Header('Content-Type', 'application/xml')
  async getCategorySitemap() {
    return this.sitemapService.generateCategorySitemap();
  }

  @Get('novel.xml')
  @Header('Content-Type', 'application/xml')
  async getNovelSitemap() {
    return this.sitemapService.generateNovelSitemap();
  }

  @Get('chapter.xml')
  @Header('Content-Type', 'application/xml')
  async getChapterSitemap() {
    return this.sitemapService.generateChapterSitemap();
  }
}
